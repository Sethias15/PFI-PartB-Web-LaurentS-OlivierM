import Model from './model.js';
import UserModel from './user.js';
import Repository from '../models/repository.js';

export default class PhotosLike extends Model {
    constructor() {
        super();
        this.addField('UsersId', 'object');
    }

    bindExtraData(instance) {
        instance = super.bindExtraData(instance);
        let usersRepository = new Repository(new UserModel());
        let users = new Array();
        for(let u of instance.UsersId) {
            let user = usersRepository.get(u);
            users.push(user);
        }
        instance.Users = users;
        instance.LikeCount = instance.UsersId.length;
        return instance;
    }
}