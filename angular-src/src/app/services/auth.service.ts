import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { JwtHelperService } from "@auth0/angular-jwt";
import { User } from "../models/User";

let headerJson = {
    "Content-type": "application/json"
};
const httpOptions = {
    headers: new HttpHeaders(headerJson)
};

const localurl = "http://localhost:5000/";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    authToken: any;
    user: any;

    constructor(private http: HttpClient) {}

    storeUserData(token, user) {
        // Angular automatically searches of id_token
        localStorage.setItem("id_token", token);

        // localStorage can not save object so just stringified object
        localStorage.setItem("user", JSON.stringify(user));

        this.authToken = token;
        this.user = user;
    }

    registerUser(user): Observable<User> {
        return this.http.post<User>(`users/register`, user, httpOptions);
    }

    loginUser(user): Observable<User> {
        return this.http.post<User>(`users/login`, user, httpOptions);
    }

    // Check the jwt to get if user is loggedin
    loggedIn() {
        const helper = new JwtHelperService();
        this.loadToken();
        return helper.isTokenExpired(this.authToken);
    }

    logout() {
        this.authToken = null;
        this.user = null;
        localStorage.clear();
    }

    loadToken() {
        const token = localStorage.getItem("id_token");
        this.authToken = token;
    }

    getProfile(): Observable<User> {
        this.loadToken();
        let headers = new HttpHeaders({
            ...headerJson,
            Authorization: this.authToken
        });
        return this.http.get<User>(`users/profile`, { headers });
    }
}
