import Model from './model.js';
import Repository from '../models/repository.js';

export default class PhotoLikes extends Model {
    constructor() {
        super();
        this.addField('UsersId', 'object');
    }

    bindExtraData(instance) {
        instance = super.bindExtraData(instance);
        let usersRepository = new Repository(new UserModel());
        let users = new Array();
        let names = new Array();
        for(let u in instance.UsersId) {
            let user = usersRepository.get(u);
            users.push(user);
            names.push(user.Name);
        }
        instance.Users = users;
        instance.UsersNames = names;
        return instance;
    }
}