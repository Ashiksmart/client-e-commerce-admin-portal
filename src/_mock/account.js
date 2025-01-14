// ----------------------------------------------------------------------

import { getToken } from "../services/AppService";

const account = {
  displayName: getToken()?.roles,
  email: 'superadmin@email.com',
  photoURL: 'assets/user-profile-icon.png',
};

export default account;
