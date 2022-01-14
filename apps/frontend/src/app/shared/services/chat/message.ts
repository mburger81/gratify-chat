import firebase from 'firebase/compat/app';

export interface Message {
    createdAt: firebase.firestore.FieldValue;
    id: string;
    from: string;
    msg: string;
    fromName: string;
    myMsg: boolean;
}
