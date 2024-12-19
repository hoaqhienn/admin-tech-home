import { authApi } from './authApi';
import { chatApi } from './chatApi';
import { propertyApi } from './propertyApi';
import { residentApi } from './residentApi';
import { serviceApi } from './serviceApi';
import { adApi } from './adApi';

export const apis = {
  authApi,
  chatApi,
  propertyApi,
  residentApi,
  serviceApi,
  adApi,
} as const;

// Export individual APIs for direct usage
export { authApi, chatApi, propertyApi, residentApi, serviceApi, adApi };

export {
  useGetAdvertisementsQuery,
  useUpdateAdvertisementMutation,
  useDeleteAdvertisementMutation,
  useGetOutsourcingServicesQuery,
  useUpdateOutsourcingServiceMutation,
  useDeleteOutsourcingServiceMutation,
} from './adApi';

// Export hooks
export { useLoginMutation, useGetCurrentUserQuery, useChangePasswordMutation } from './authApi';

export {
  useGetAllChatsQuery,
  useSendMessageMutation,
  useAddMemberMutation,
  useCreateChatMutation,
  useDeleteChatMutation,
  useDeleteMessageMutation,
  useGetChatDetailsQuery,
  useGetMessagesByChatIdQuery,
  useGetAllFilesByChatIdQuery,
  useRemoveMemberMutation,
} from './chatApi';

export {
  useGetBuildingsQuery,
  useAddBuildingMutation,
  useNewBuildingMutation,
  useUpdateBuildingMutation,
  useDeleteBuildingMutation,
  useGetFloorsQuery,
  useGetFloorsByBuildingQuery,
  useAddFloorMutation,
  useUpdateFloorMutation,
  useDeleteFloorMutation,
  useGetApartmentsQuery,
  useGetApartmentByIdQuery,
  useGetApartmentsByFloorQuery,
  useSearchApartmentsMutation,
  useUpdateApartmentMutation,
  useJoinToApartmentMutation,
  useLeaveOutApartmentMutation,
  useDeleteApartmentMutation,
  useGetFacilitiesQuery,
  useAddFacilityMutation,
  useUpdateFacilityMutation,
  useDeleteFacilityMutation,
} from './propertyApi';

export {
  useGetResidentsQuery,
  useAddResidentMutation,
  useDeleteResidentMutation,
  useDeleteResidentByIdcardMutation,
  useActiveResidentMutation,
  useUpdateResidentMutation,
  useGetVehiclesQuery,
  useAddVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} from './residentApi';

export {
  useAddServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useAddEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetEventsQuery,
  useGetBillsQuery,
  useGetPaymentsQuery,
  useAddNotificationMutation,
  useDeleteComplaintMutation,
  useDeleteNotificationMutation,
  useDeletePaymentMutation,
  useGetComplaintsQuery,
  useGetNotificationsQuery,
  useSendNotificationMutation,
  useDeleteServiceBookingMutation,
  useGetServiceBookingsQuery,
  useGetServiceQuery,
  useUpdateComplaintStatusMutation,
  useUpdateNotificationMutation,
} from './serviceApi';
