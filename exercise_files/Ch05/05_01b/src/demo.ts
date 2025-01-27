interface Contact {
    id: number;
}

const currentUser1 = {
    id: 1234,
    roles: ["ContactEditor"],
    isInRole(role: string): boolean {
        return this.roles.contains(role);
    }
}

class ContactRepository1 {
    private contacts: Contact[] = [];

    getContactById(id: number): Contact | null {
        console.trace(`ContactRepository.getContactById: BEGIN`);

        if (!currentUser.isInRole("ContactViewer")) {
            throw Error("User not authorized to execute this action");
        }

        const contact = this.contacts.find(x => x.id === id);

        console.debug(`ContactRepository.getContactById: END`);

        return contact;
    }

    save(contact: Contact): void {
        console.trace(`ContactRepository.save: BEGIN`);

        if (!currentUser.isInRole("ContactEditor")) {
            throw Error("User not authorized to execute this action");
        }

        const existing = this.getContactById(contact.id);

        if (existing) {
            Object.assign(existing, contact);
        } else {
            this.contacts.push(contact);
        }

        console.debug(`ContactRepository.save: END`);
    }
}