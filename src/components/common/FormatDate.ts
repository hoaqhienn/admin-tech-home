// Format date to dd/mm/yyyy
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
};

export default formatDate;