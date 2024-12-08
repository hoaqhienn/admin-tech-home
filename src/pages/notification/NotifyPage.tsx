import Grid from '@mui/material/Grid';
import { Button, Modal, Paper, Typography } from '@mui/material';
import NotifyDataGrid from './NotifyDataGrid';
import { useState } from 'react';
import ResidentsDataGrid from 'pages/residents/ResidentsDataGrid';
import { ResidentViaApartment } from 'interface/Residents';
import { Notify } from 'interface/Utils';

const NotifyPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedResidents, setSelectedResidents] = useState<ResidentViaApartment[]>([]);
  const [notify, setNotify] = useState<Notify | null>(null);

  const handSendNoification = async () => {
    const tokens = selectedResidents
      .map((resident) => resident.fcmToken)
      .filter((token): token is string => token !== undefined);

    console.log(tokens);

    if (tokens.length === 0 || tokens.length === 1) {
      return;
    }

    // check notify not null
    if (!notify) {
      return;
    }

    console.log(selectedResidents);
    try {
      // const res = await sendNotifications({
      //   tokens: tokens,
      //   title: notify.notificationTitle,
      //   body: notify.notificationBody,
      // });
      // console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">Danh sách thông báo</Typography>
        </Grid>
        <Grid item xs={12}>
          <NotifyDataGrid
            onSendNotification={(notify) => {
              setNotify(notify);
              setModalOpen(true);
            }}
          />
        </Grid>
      </Grid>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            borderRadius: 0,
          }}
        >
          <div className="flex flex-row space-x-10 items-center">
            <Typography variant="h3">Chọn người gửi</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handSendNoification();
              }}
            >
              Gửi
            </Button>
          </div>
          <ResidentsDataGrid
            onSelectionChange={(selectedResidents) => {
              setSelectedResidents(selectedResidents);
            }}
          />
        </Paper>
      </Modal>
    </>
  );
};

export default NotifyPage;
