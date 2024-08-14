import axiosInstance from '../api/axiosInstance';
import { decryptString, encryptString } from '../utils/encyrptString';


export const fetchUsers = async (currentPage: number) => {
    try {
        const encryptedToken = sessionStorage.getItem("jwtToken");
        if (!encryptedToken) {
            throw new Error("No token found. Please log in again.");
        }

        const token = decryptString(encryptedToken);
        const response = await axiosInstance.post("/users/listAll", {
            token,
            pageNumber: currentPage,
            pageSize: 20,
        });

        return response.data.payload;
    } catch (error) {
        console.error("Failed to fetch users", error);
        throw error;
    }
};

export const addUser = async (firstname: string, lastname: string, username: string) => {
    try {
        const encryptedToken = sessionStorage.getItem("jwtToken");
        if (!encryptedToken) {
            throw new Error("No token found. Please log in again.");
        }

        const token = decryptString(encryptedToken);
        await axiosInstance.post("/users/create", {
            token,
            payload: {
                usrFirstname: firstname,
                usrLastname: lastname,
                usrUsername: username,
            },
        });
    } catch (error) {
        console.error("Failed to add user", error);
        throw error;
    }
};

export const editUser = async (id: number, firstname: string, lastname: string, username: string, status: string) => {
    try {
        const encryptedToken = sessionStorage.getItem("jwtToken");
        if (!encryptedToken) {
            throw new Error("No token found. Please log in again.");
        }

        const token = decryptString(encryptedToken);
        await axiosInstance.post("/users/edit", {
            token,
            payload: {
                usrId: id,
                usrFirstname: firstname,
                usrLastname: lastname,
                usrUsername: username,
                usrStatus: status,
            },
        });
    } catch (error) {
        console.error("Failed to edit user", error);
        throw error;
    }
};


export const login = async (username: string, password: string) => {
    const response = await axiosInstance.post("/users/login", {
        username,
        password,
    });

    sessionStorage.setItem("jwtToken", encryptString(response.data.token));

    localStorage.setItem("user", JSON.stringify({
        usrFirstname: response.data.payload.usrFirstname,
        usrLastname: response.data.payload.usrLastname,
        usrUsername: response.data.payload.usrUsername,
      }));

    return response.data;
};

export const logout = async () => {
    try {
        const encryptedToken = sessionStorage.getItem('jwtToken');
        if (!encryptedToken) {
            throw new Error("No token found. Please log in again.");
        }

        const token = decryptString(encryptedToken);
        await axiosInstance.post("/users/logOut", { token });

        sessionStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
    } catch (error) {
        console.error("Failed to log out", error);
        throw error;
    }
};