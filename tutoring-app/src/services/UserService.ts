import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import { UserModel } from "../models/UserModel";

class UserService {
    async getUsers(): Promise<UserModel[]> {
        const q = query(collection(db, 'Users'));
        const querySnapshot = await getDocs(q);
        const users: UserModel[] = [];
        querySnapshot.forEach((doc) => {
            const docData = doc.data();
            if (docData) {
                const user: UserModel = {
                    id: doc.id,
                    userName: docData.userName,
                    firstName: docData.firstName,
                    lastName: docData.lastName
                };
                users.push(user);
            }
        });

        return users;
    }
}

export default new UserService();