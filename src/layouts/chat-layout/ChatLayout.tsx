// import { Badge, Grid, IconButton, Modal, Box } from '@mui/material';
// import IconifyIcon from 'components/base/IconifyIcon';
// import { ChatList } from './components/ChatList';
// import { ChatInfo } from './components/ChatInfo';
// import { ImageGallery } from './components/ImageGallery';
// import { useEffect, useState } from 'react';
// import ChatHeader from './components/Header';
// import MessagePanel from './components/MessagePanel';
// import { useChatHandlers, useChatState } from 'hooks/chat/useChatState'; // Added useChatData import

// const modalStyle = {
//   position: 'absolute' as const,
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: '100%',
//   maxWidth: '100%',
//   height: '100%',
//   maxHeight: '100%',
//   bgcolor: '#f6f6f6',
//   boxShadow: 24,
//   p: 1,
// };

// interface ChatLayoutProps {
//   // Add any props if needed
// }

// const ChatLayout: React.FC<ChatLayoutProps> = () => {
//   const state = useChatState();
//   const { isLoading, error } = useChatState();
//   const handlers = useChatHandlers(state);

//   const [files, setFiles] = useState<File[]>([]);

//   const handleFileSelect = (newFiles: File[]) => {
//     setFiles((prevFiles) => [...prevFiles, ...newFiles]);
//   };

//   const handleFileRemove = (fileToRemove: File) => {
//     setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
//   };

//   // Show error if socket has issues
//   useEffect(() => {
//     if (state.socketState?.error) {
//       console.error('Socket error:', state.socketState.error);
//       // You might want to add a toast notification here
//       // Example: toast.error('Connection error. Please try again.');
//     }
//   }, [state.socketState?.error]);

//   // Show loading state while chat data is being fetched
//   if (isLoading) {
//     return null; // Or return a loading spinner
//   }

//   // Show error state if chat data fetch failed
//   if (error) {
//     return null; // Or return an error message
//   }

//   return (
//     <>
//       <IconButton onClick={handlers.handleChatOpen} size="large" aria-label="Open chat">
//         <Badge color="error">
//           <IconifyIcon icon="ic:outline-message" />
//         </Badge>
//       </IconButton>

//       <Modal
//         open={state.isOpen}
//         onClose={handlers.handleChatClose}
//         aria-labelledby="chat-modal"
//         aria-describedby="chat-modal-description"
//       >
//         <Box sx={modalStyle}>
//           <IconButton
//             sx={{
//               position: 'absolute',
//               top: 10,
//               right: 10,
//               zIndex: 1,
//             }}
//             onClick={handlers.handleChatClose}
//             size="large"
//             aria-label="Close chat"
//           >
//             <IconifyIcon icon="ic:outline-close" />
//           </IconButton>

//           <Grid container spacing={1}>
//             <Grid item md={12} xs={12}>
//               <ChatHeader searchQuery={state.searchQuery} setSearchQuery={state.setSearchQuery} />
//             </Grid>

//             <Grid item md={3} xs={3}>
//               <ChatList
//                 groupChats={state.groupChats}
//                 selectedGroupChat={state.selectedGroupChat}
//                 onChatSelect={handlers.handleChatSelect}
//               />
//             </Grid>

//             <Grid item md={6} xs={6}>
//               <MessagePanel
//                 messages={state.messages}
//                 newMessage={state.newMessage}
//                 onMessageChange={state.setNewMessage}
//                 onKeyPress={handlers.handleKeyPress}
//                 onSend={handlers.handleSend}
//                 onFileSelect={handleFileSelect}
//                 onFileRemove={handleFileRemove}
//               />
//             </Grid>

//             <Grid item md={3} xs={3}>
//               <ChatInfo selectedGroupChat={state.selectedGroupChat} />
//             </Grid>
//           </Grid>
//         </Box>
//       </Modal>

//       <ImageGalleryModal
//         isOpen={state.galleryState.isOpen}
//         onClose={handlers.handleGalleryClose}
//         messages={state.messages}
//         currentIndex={state.galleryState.currentIndex}
//       />
//     </>
//   );
// };

// // Separate ImageGalleryModal component for better organization
// const ImageGalleryModal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   messages: any[]; // Replace 'any' with your message type
//   currentIndex: number;
// }> = ({ isOpen, onClose, messages, currentIndex }) => (
//   <Modal
//     open={isOpen}
//     onClose={onClose}
//     aria-labelledby="image-gallery-modal"
//     aria-describedby="image-gallery-modal-description"
//   >
//     <Box sx={modalStyle}>
//       <ImageGallery
//         files={messages.flatMap((msg) => msg.Files)}
//         initialIndex={currentIndex}
//         onClose={onClose}
//       />
//     </Box>
//   </Modal>
// );

// export default ChatLayout;
