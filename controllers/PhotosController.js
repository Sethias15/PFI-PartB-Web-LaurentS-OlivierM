import Authorizations from '../authorizations.js';
import Repository from '../models/repository.js';
import PhotoModel from '../models/photo.js';
import * as utilities from "../utilities.js";
import CollectionFilter from "../models/collectionFilter.js";
import Controller from './Controller.js';

export default class PhotosController extends Controller {
    constructor(HttpContext) {
        super(HttpContext, new Repository(new PhotoModel()), Authorizations.user());
        // this.photoLikesRepository = new Repository(new PhotoLikeModel());
    }
    create(photo) {
        if (this.repository != null) {
            photo.Date = utilities.nowInSeconds();
            if (photo.Shared == null) {
                photo.Shared = false;
            } else { photo.Shared = true; }
            if (photo.Image == "") {
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
    getAll(params = null) {
        let objectsList = this.repository.objects();
        let bindedDatas = [];
        let isUserLogged = false;
        let user = "";
        console.log(params);
        if (params.user) {
            isUserLogged = true;
            user = params.user;
            delete params.user;
        }
        console.log(params);
        if (objectsList)
            for (let data of objectsList) {
                if (data.Shared == true || (isUserLogged && data.OwnerId == user))
                    bindedDatas.push(this.repository.model.bindExtraData(data));
            };
        let collectionFilter = new CollectionFilter(bindedDatas, params);
        return collectionFilter.get();
    }
    get(id, user) {
        if (Authorizations.readGranted(this.HttpContext, this.authorizations)) {
            if (this.repository != null) {
                if (id !== undefined) {
                    let data = this.repository.get(id);
                    if (data != null)
                        this.HttpContext.response.JSON(data);
                    else
                        this.HttpContext.response.notFound("Ressource not found.");
                } else
                    this.HttpContext.response.JSON(this.getAll(this.HttpContext.path.params, user), this.repository.ETag, false, this.authorizations);
            } else
                this.HttpContext.response.notImplemented();
        } else
            this.HttpContext.response.unAuthorized("Unauthorized access");
    }
}