import Model from './model.js';
import UserModel from './user.js';
import Repository from '../models/repository.js';

export default class Photo extends Model {
    constructor() {
        super();
        this.addField('OwnerId', 'string');
        this.addField('Title', 'string');
        this.addField('Description', 'string');
        this.addField('Image', 'asset');
        this.addField('Date', 'integer');
        this.addField('Shared', 'boolean');
        this.addField('Likes', 'object');

        this.setKey("Title");
    }

    bindExtraData(instance) {
        instance = super.bindExtraData(instance);
        let usersRepository = new Repository(new UserModel());
        instance.Owner = usersRepository.get(instance.OwnerId);
        instance.Ownername = instance.Owner.Name;
        let users = new Array();
        for (let u of instance.Likes) {
            let user = usersRepository.get(u);
            users.push(user);
        }
        instance.UsersLikes = users;
        instance.Likecount = instance.Likes.length;
        return instance;
    }
}