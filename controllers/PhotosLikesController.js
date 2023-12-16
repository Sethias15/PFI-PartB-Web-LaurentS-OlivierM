import Repository from '../models/repository.js';
import PhotoLikeModel from '../models/photoLike.js';
import Controller from './Controller.js';

export default class PhotosLikesController extends Controller {
    constructor(HttpContext) {
        super(HttpContext, new Repository(new PhotoLikeModel()));
    }
}