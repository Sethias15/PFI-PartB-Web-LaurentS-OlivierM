import Authorizations from '../authorizations.js';
import Repository from '../models/repository.js';
import PhotoModel from '../models/photo.js';
import * as utilities from "../utilities.js";
//import PhotoLikeModel from '../models/photoLike.js';
import Controller from './Controller.js';

export default class PhotosController extends Controller {
    constructor(HttpContext) {
        super(HttpContext, new Repository(new PhotoModel()), Authorizations.user());
       // this.photoLikesRepository = new Repository(new PhotoLikeModel());
    }
    create(photo) {
        if (this.repository != null) {
            photo.Date = utilities.nowInSeconds();
            if (photo.Shared == null){
                photo.Shared = false;
            }else {photo.Shared = true;}
            if (photo.Image == ""){
                photo.Image = null;
            }
            let newPhoto = this.repository.add(photo);
            if (this.repository.model.state.isValid) {
                this.HttpContext.response.created(newPhoto);
            } else {
                if (this.repository.model.state.inConflict)
                    this.HttpContext.response.conflict(this.repository.model.state.errors);
                else
                    this.HttpContext.response.badRequest(this.repository.model.state.errors);
            }
        } else
            this.HttpContext.response.notImplemented();
    }
}