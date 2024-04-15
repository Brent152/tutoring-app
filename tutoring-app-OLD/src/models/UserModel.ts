export class UserModel {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;

  constructor(id: string, userName: string, firstName: string, lastName: string) {
    this.id = id;
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}