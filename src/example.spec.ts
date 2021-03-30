class FriendsList {
    friends = [];

    addFriend(name) {
        this.friends.push(name);
        this.announceFriendship(name);
    }

    announceFriendship(name) {
        global.console.log(`${name} is now my friend.`);
    }

    removeFriend(name) {
        const idx = this.friends.indexOf(name);
        if (idx === -1) {
            throw new Error('Friend not found');
        }

        this.friends.splice(idx, 1);
    }
}

// tests
describe('FriendsList', () => {
    let friendsList;

    beforeEach(() => {
        friendsList = new FriendsList();

    });

    it('Intializes friends list', () => {
        expect(friendsList.friends.length).toEqual(0);
    });
    it('adds a friend to the list', () => {
        friendsList.addFriend('TAM LE');

        expect(friendsList.friends.length).toEqual(1);
    });

    it('announces friendship', () => {
        friendsList.announceFriendship = jest.fn();

        expect(friendsList.announceFriendship).not.toHaveBeenCalled();
        friendsList.addFriend('Ariel');

        expect(friendsList.announceFriendship).toHaveBeenCalledWith('Ariel');
    });

    describe('removeFriend', () => {
        it('remove a friend from friendsList', () => {
            friendsList.addFriend('Ariel');
            expect(friendsList.friends[0]).toEqual('Ariel');
            friendsList.removeFriend('Ariel');
            expect(friendsList.friends[0]).toBeUndefined();
        });

        it('thow an error as friend does not exist', () => {
            expect(() => friendsList.removeFriend('Ariel')).toThrow(new Error('Friend not found'));
        });
    });
});

