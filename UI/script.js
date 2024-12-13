class Ticket {
	constructor(start_place, end_place, start_date, finish_date, cost, type, purchased) {
		if (!Ticket.validateProperties(
			[
				start_place, 
				end_place, 
				start_date, 
				finish_date, 
				cost, 
				type, 
				purchased
			])) {
			throw new Error("Fields should be defined.");
		}
		this.start_place = start_place;
        this.end_place = end_place;
        this.start_date = start_date;
        this.finish_date = finish_date;
        this.cost = cost;
        this.type = type;
        this.purchased = purchased;
    }
	
	static validateProperties(requiredFields) {
    for (const field of requiredFields) {
        if (field === null || field === undefined) {
            return false;
        }
    }
    return true;
	}
}

class TicketInfManager {
	#objInfArray = [];
	#size = 0;
	
    constructor() {}

	#generateId() {
		this.#size = this.#size + 1;
		return this.#size;
	}

	addObj(Obj) {
		if (!(Obj instanceof Ticket)) {
            throw new Error("Only class Ticket objects can be added.");
        }
		const id = this.#generateId();
		this.#objInfArray.push({id, Obj});
        return id;
	}

    getObjs(skip = 0, top = 0, filterConfig={}) {
		let filteredObjs = this.#objInfArray;
		for (let key in filterConfig) {
            filteredObjs = filteredObjs.filter(item => item.Obj[key] === filterConfig[key]);
        }
		if (skip < 0 || skip > filteredObjs.length) {
			throw new Error("Skip out of range!");
		}
		if (top < 0 || top > filteredObjs.length - skip) {
			throw new Error("Top out of range!");
		}
		if (top == 0) {
			return filteredObjs.slice(skip, filteredObjs.length - skip);
		}
		return filteredObjs.slice(skip, skip + top);
	}
	
	getObj(id) {
		if (!id instanceof Number || id > this.#size || id < 1) {
			throw new Error("Incorrect ID.");
		}
		const found = this.#objInfArray.find(item => item.id === id);
		if (found) {
			return found;
		} else {
			console.log("Object not found");
			return false;
		}
	}
	
	editObj(id, Obj) {
		if (!Obj instanceof Ticket) {
			throw new Error("Only class Ticket objects can be added.");
        }
		let old_Obj = this.getObj(id);
		if (!old_Obj) {
			return false;
		}
		const index = this.#objInfArray.findIndex(item => item.id === id);	
		const fieldsToUpdate = [
			'start_place',
			'end_place',
			'start_date',
			'finish_date',
			'cost',
			'type',
			'purchased'
		];
		fieldsToUpdate.forEach(field => {
            if (Obj[field] !== null && Obj[field] !== undefined) {
                this.#objInfArray[index].Obj[field] = Obj[field];
            }
        });
		return true;
	}
	
	removeObj(id) {
		let old_Obj = this.getObj(id);
		if (!old_Obj) {
			return false;
		}
		this.#objInfArray = this.#objInfArray.filter(item => item.id !== id);
		return true;
	}
	
	addAll(objs) {
		const invalidObjs = objs.filter(obj => !(obj instanceof Ticket));
		if (invalidObjs.length > 0) {
			throw new Error("Some objects are invalid.");
		}
		objs.forEach(obj => this.addObj(obj));
}

	clear() {
		this.#objInfArray = [];
	}
}

const manager = new TicketInfManager();
const ticketTypes = ["Купе", "Плацкарт", "Сидячий", "СВ"];
const startPlaces = ["Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань"];
const endPlaces = ["Владивосток", "Ростов-на-Дону", "Красноярск", "Волгоград", "Самара"];
for (let i = 0; i < 20; i++) {
    const start_place = startPlaces[Math.floor(Math.random() * startPlaces.length)];
    const end_place = endPlaces[Math.floor(Math.random() * endPlaces.length)];
    const start_date = new Date(2025, Math.floor(Math.random() * 11), Math.floor(Math.random() * 28), Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    const finish_date = new Date(start_date);
    finish_date.setHours(finish_date.getHours() + Math.floor(Math.random() * 5) + 1);
    const cost = Math.floor(Math.random() * (1500 - 500) + 500);
    const type = ticketTypes[Math.floor(Math.random() * ticketTypes.length)];
    const purchased = Math.random() > 0.5;
    const ticket = new Ticket(start_place, end_place, start_date, finish_date, cost, type, purchased);
    manager.addObj(ticket);
}
console.log(manager.getObjs(2, 4));
console.log(manager.getObjs(0, 0, { start_place: "Москва" }));
console.log(manager.getObj(5));
console.log(manager.editObj(3, new Ticket("Заслоново", "Никосия", new Date(2025, 7, 2, 16, 29), new Date(2025, 7, 6, 12, 0), 800, "СВ", true)));
console.log(manager.getObj(3));
console.log(manager.removeObj(13));
console.log(manager.getObj(13));
const new_tickets = [
		new Ticket("Минск", "Санкт-Петербург", new Date(2025, 4, 29, 10, 00), new Date(2025, 4, 29, 16, 00), 200, "Купе", true), 
		new Ticket("Санкт-Петербург", "Минск", new Date(2025, 6, 30, 14, 00), new Date(2025, 4, 29, 20, 00), 200, "Купе", true)
	]
manager.addAll(new_tickets);
console.log(manager)