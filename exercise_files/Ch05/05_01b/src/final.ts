interface Contact {
    id: number;
}

const currentUser = {
    id: 1234,
    roles: ["ContactEditor"],
    isInRole(role: string): boolean {
        return this.roles.contains(role);
    },
    isAuthenticated(): boolean {
        return true
    }
}


function authorize(role: string) {
    return function authorizeDecorator(target: any, property: string, descriptor: PropertyDescriptor) {
        const wrapper = descriptor.value
        descriptor.value = () => {
            if (!currentUser.isAuthenticated() || !currentUser.isInRole(role)) {
                throw Error("Not authorised")
            }
            try {
                return wrapper.apply(this, arguments)
            } catch (err) {
                return err;
            }
        }

    }
}

// target is the constructor function of the class
// class decarotor - to change classes dynamically 
function freeze(target: Function) {
    Object.freeze(target)
    Object.freeze(target.prototype)
}

function singleton<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class Singleton extends constructor {
        static _instance = null
        constructor(...args) {
            super(...args)

            if (Singleton._instance != null) {
                throw Error("There exists an instance for this class")
            }
            Singleton._instance = this
        } // pass the arguments to the base class constructor

    }
}

function auditable(target: object, key: string | symbol) {
    // get the initial value, before the decorator is applied
    let val = target[key];

    // then overwrite the property with a custom getter and setter
    Object.defineProperty(target, key, {
        get: () => val,
        set: (newVal) => {
            console.log(`${key.toString()} changed: `, newVal);
            val = newVal;
        },
        enumerable: true,
        configurable: true
    })
}


@freeze
@singleton
class ContactRepository {
    @auditable
    private contacts: Contact[] = [];

    @authorize("ContactViewer")
    getContactById(id: number): Contact | null {
        const contact = this.contacts.find(x => x.id === id);
        return contact;
    }

    @authorize("ContactEditor")
    save(contact: Contact): void {
        const existing = this.getContactById(contact.id);

        if (existing) {
            Object.assign(existing, contact);
        } else {
            this.contacts.push(contact);
        }
    }
}