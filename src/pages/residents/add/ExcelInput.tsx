import { FC, useState, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import {
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Paper,
  Snackbar,
  styled,
  alpha,
  CardActions,
} from '@mui/material';
import { Upload, Download, FileSpreadsheet, Terminal } from 'lucide-react';
import { useAddResidentMutation, useDeleteResidentByIdcardMutation } from 'api/residentApi';

// Styled components
const InputButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  marginRight: theme.spacing(2),
  '& input': {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0,
    width: '100%',
    cursor: 'pointer',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  '& svg': {
    width: 20,
    height: 20,
  },
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: 250,
  color: theme.palette.text.secondary,
  '& svg': {
    marginBottom: theme.spacing(2),
    width: 48,
    height: 48,
  },
  '& p': {
    fontSize: theme.typography.body2.fontSize,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  fontWeight: 'bold',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

// Type definitions
interface DataRow {
  [key: string]: string;
}

const ExcelInput: FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const processExcelData = (workbook: XLSX.WorkBook): void => {
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Parse as any[] first to handle raw Excel data
    const rawData = XLSX.utils.sheet_to_json<any[]>(worksheet, {
      header: 1,
      blankrows: true,
      defval: '',
    });

    if (rawData.length > 0) {
      // First row contains headers
      const headers = rawData[0].map(String);
      setHeaders(headers);

      // Process remaining rows
      const rows = rawData.slice(1).map((row) => {
        const dataRow: DataRow = {};
        headers.forEach((header, index) => {
          const value = row[index];
          // Ensure all data is treated as string
          dataRow[header] = value?.toString() || '';
        });
        return dataRow;
      });

      setData(rows);
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const data = new Uint8Array(buffer);
        const workbook = XLSX.read(data, { type: 'array' });
        processExcelData(workbook);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        // You could add error handling UI here
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExport = (): void => {
    if (data.length === 0) return;

    try {
      const exportData = data.map((row) => {
        const exportRow: DataRow = {};
        headers.forEach((header) => {
          exportRow[header] = row[header];
        });
        return exportRow;
      });

      const ws = XLSX.utils.json_to_sheet(exportData, { header: headers });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      const exportFileName = fileName ? `processed-${fileName}` : 'exported-data.xlsx';
      XLSX.writeFile(wb, exportFileName);
    } catch (error) {
      console.error('Error exporting Excel file:', error);
      // You could add error handling UI here
    }
  };

  // check data if have two column is fullname and idcard
  const hasFullnameAndIdcard = headers.includes('fullname') && headers.includes('idcard');

  const handleCheckingData = () => {
    // check & return snackbar
    if (!hasFullnameAndIdcard) {
      setMessage('Dữ liệu không hợp lệ! Vui lòng kiểm tra lại file Excel.');
      setSnackbarOpen(true);
      return;
    }
    handleBulkAdd();
  };

  const [addResident] = useAddResidentMutation();
  const [deleteResidentByIdcard] = useDeleteResidentByIdcardMutation();

  const handleBulkAdd = async () => {
    if (!hasFullnameAndIdcard) {
      setMessage('Dữ liệu không hợp lệ! Vui lòng kiểm tra lại file Excel.');
      setSnackbarOpen(true);
      return;
    }

    try {
      const successfulAdds: { fullname: string; idcard: string, apartmentId?: number }[] = []; 

      for (const resident of data) {
        try {
          await addResident({
            fullname: resident.fullname,
            idcard: resident.idcard,
            apartmentId: parseInt(resident.apartmentId), // Nếu có thuộc tòa nhà thì truyền vào
          }).unwrap(); // unwrap để lấy kết quả hoặc bắt lỗi

          // Lưu lại các mục đã thêm thành công
          successfulAdds.push({ fullname: resident.fullname, idcard: resident.idcard });
        } catch (error: any) {
          console.error('Lỗi khi thêm cư dân:', error);

          // Hiển thị lỗi cụ thể
          setMessage(
            `Thêm cư dân thất bại: ${error.data.message || 'Vui lòng kiểm tra lại dữ liệu.'}`,
          );
          setSnackbarOpen(true);

          // Gọi rollback
          await rollbackResidents(successfulAdds);

          return; // Kết thúc ngay khi gặp lỗi
        }
      }

      setMessage('Danh sách cư dân đã được thêm thành công.');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Lỗi không mong muốn:', error);
      setMessage('Có lỗi xảy ra. Vui lòng thử lại.');
      setSnackbarOpen(true);
    }
  };

  // Hàm rollback
  const rollbackResidents = async (successfulAdds: { fullname: string; idcard: string }[]) => {
    try {
      for (const added of successfulAdds) {
        // Gọi hàm xóa với unwrap
        await deleteResidentByIdcard(added.idcard).unwrap(); // unwrap trả về Promise<void>
      }
      console.log('Rollback hoàn tất!');
    } catch (rollbackError) {
      console.error('Lỗi khi rollback:', rollbackError);
    }
  };

  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Bảng điều khiển dữ liệu Excel
        </Typography>

        <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
          <InputButton variant="text" startIcon={<Upload />}>
            Nhập
            <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
          </InputButton>

          <StyledButton
            variant="text"
            startIcon={<Download />}
            onClick={handleExport}
            disabled={data.length === 0}
          >
            Xuất
          </StyledButton>

          <StyledButton
            variant="text"
            startIcon={<Terminal />}
            onClick={() => {
              console.table(data);
              setMessage('Đã ghi log vào console. Nhấn F12 để xem.');
              setSnackbarOpen(true);
            }}
            disabled={data.length === 0}
            color="info"
          >
            Xem log
          </StyledButton>
        </Box>

        {data.length > 0 ? (
          <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map((header, index) => (
                    <StyledTableCell key={index}>{header}</StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, rowIndex) => (
                  <StyledTableRow key={rowIndex}>
                    {headers.map((header, cellIndex) => (
                      <TableCell key={cellIndex}>{row[header]}</TableCell>
                    ))}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <EmptyStateContainer>
            <FileSpreadsheet />
            <Typography variant="body2">
              Chưa có dữ liệu. Vui lòng tải lên file Excel hoặc CSV để bắt đầu.
            </Typography>
          </EmptyStateContainer>
        )}
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            handleCheckingData();
          }}
          disabled={data.length === 0}
        >
          Thêm danh sách cư dân
        </Button>
      </CardActions>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={message}
      />
    </Card>
  );
};

export default ExcelInput;
