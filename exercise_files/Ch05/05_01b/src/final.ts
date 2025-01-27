interface Contact {
    id: number;
}

const currentUser = {
    id: 1234,
    roles: ["ContactEditor"],
    isInRole(role: string): boolean {
        return this.roles.contains(role);
    },
    isAuthenticated():boolean {
        return true
    }
}

function authorize(target:any, property:string, descriptor:PropertyDescriptor){
    const wrapper = descriptor.value
    descriptor.value = () => {
        if(!currentUser.isAuthenticated()){
            throw Error("Not authorised")
        }
        try{
            return wrapper.apply(this,arguments)
        }catch(err){
            return err
        }
    }

}
//implement log decarator
class ContactRepository {
    private contacts: Contact[] = [];

    @authorize
    getContactById(id: number): Contact | null {
        const contact = this.contacts.find(x => x.id === id);
        return contact;
    }

    @authorize
    save(contact: Contact): void {
        const existing = this.getContactById(contact.id);

        if (existing) {
            Object.assign(existing, contact);
        } else {
            this.contacts.push(contact);
        }
    }
}