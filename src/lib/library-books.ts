// Only approved, publicly distributable files. Private books must be served by an authenticated backend, never from public/.
export type LibraryBook = {id:string;title:string;author:string;url:string};
export const localBooks: LibraryBook[] = [];
