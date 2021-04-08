
import User from '../database/models/user.model';
import Comment from '../database/models/comment.model';


export interface IPost {
  slug: string;
  title: string;
  description: string;
  tagList?: [string];
  images?: [string];
  accessibilityList?: [string];
  visitsCount: number;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
  favorited: boolean;
  favoritesCount: number;
  location: {
    name: string;
    long: number;
    lat: number
  };
  author: User;
  comments: Comment[]
}
