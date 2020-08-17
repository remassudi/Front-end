import User from '../routes/user';
import Book from '../routes/book';
import Home from '../routes/home';

export default [
   {
      path: 'user',
      component: User
   },
   {
      path: 'book',
      component: Book
   },
   {
      path: 'home',
      component: Home
   }
]

