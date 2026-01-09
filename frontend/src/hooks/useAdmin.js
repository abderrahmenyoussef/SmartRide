import { useAdminContext } from '../context/AdminContext';

export const useAdmin = () => {
  return useAdminContext();
};
