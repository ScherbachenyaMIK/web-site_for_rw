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

class TicketType {
	constructor(value, text) {
		if (!TicketType.validateProperties(
			[
				value, 
				text
			])) {
			throw new Error("Fields should be defined and has type String.");
		}
		this.value = value;
        this.text = text;
    }
	
	static validateProperties(requiredFields) {
		for (const field of requiredFields) {
			if (field === null || field === undefined || typeof field !== 'string') {
				return false;
			}
		}
		return true;
	}
}

class Town {
	constructor(value, text) {
		if (!TicketType.validateProperties(
			[
				value, 
				text
			])) {
			throw new Error("Fields should be defined and has type String.");
		}
		this.value = value;
        this.text = text;
    }
	
	static validateProperties(requiredFields) {
		for (const field of requiredFields) {
			if (field === null || field === undefined || typeof field !== 'string') {
				return false;
			}
		}
		return true;
	}
}

class ObjInfManager {
	#objInfArray = [];
	#size = 0;
	#classRegistry = {
		Ticket,
		TicketType,
		Town
	};
	#classGeneric;
	
    constructor(classGeneric) {
		if (typeof classGeneric !== 'string' || this.#classRegistry[classGeneric] === undefined) {
			throw new Error("Generic must be a registered String type.");
		}
		this.#classGeneric = classGeneric;
	}

	#generateId() {
		this.#size = this.#size + 1;
		return this.#size;
	}

	addObj(Obj) {
		if (!(Obj instanceof this.#classRegistry[this.#classGeneric])) {
            throw new Error(`Only class '${this.#classGeneric}' objects can be added.`);
        }
		const id = this.#generateId();
		this.#objInfArray.push({id, Obj});
        return id;
	}

    getObjs(skip = 0, top = 0, filterConfig={}) {
		let filteredObjs = this.#objInfArray;
		for (let key in filterConfig) {
			if (key !== "min_cost" && key !== "max_cost" && key !== "start_date" && key !== "finish_date") {
				filteredObjs = filteredObjs.filter(item => item.Obj[key] === filterConfig[key]);
			}
        }
		if (filterConfig['min_cost'] !== undefined) {
			filteredObjs = filteredObjs.filter(item => item.Obj['cost'] >= filterConfig['min_cost']);
		}
		if (filterConfig['max_cost'] !== undefined) {
			filteredObjs = filteredObjs.filter(item => item.Obj['cost'] <= filterConfig['max_cost']);
		}
		if (filterConfig['start_date'] !== undefined) {
			filteredObjs = filteredObjs.filter(item => item.Obj['start_date'].getTime() === filterConfig['start_date'].getTime());
		}
		if (filterConfig['finish_date'] !== undefined) {
			filteredObjs = filteredObjs.filter(item => item.Obj['finish_date'].getTime() === filterConfig['finish_date'].getTime());
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
		if (typeof id !== 'number' || id > this.#size || id < 1) {
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
	
	getObjByValue(value) {
		if (typeof value !== 'string' && !(value instanceof String)) {
			throw new Error("Incorrect value.");
		}
		const found = this.#objInfArray.find(item => item.Obj['value'] === value);
		if (found) {
			return found;
		} else {
			console.log("Object not found");
			return false;
		}
	}
	
	editObj(id, Obj) {
		if (!(Obj instanceof this.#classRegistry[this.#classGeneric])) {
			throw new Error(`Only class '${this.#classGeneric}' objects can be added.`);
        }
		let old_Obj = this.getObj(id);
		if (!old_Obj) {
			return false;
		}
		const index = this.#objInfArray.findIndex(item => item.id === id);
		const fieldsToUpdate = Object.keys(old_Obj.Obj);
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
		const invalidObjs = objs.filter(obj => !(obj instanceof this.#classRegistry[this.#classGeneric]));
		if (invalidObjs.length > 0) {
			throw new Error("Some objects are invalid.");
		}
		objs.forEach(obj => this.addObj(obj));
}

	clear() {
		this.#objInfArray = [];
	}
}

let currentPage;
let filteredTickets;

function navigateTo(formId) {
    document.querySelectorAll('.form').forEach(form => {
        form.classList.remove('active');
    });
    const home = document.getElementById('home-page');
	if (formId === 'home-page') {
		home.classList.add('active');
		return;
	}
	if (formId === 'browsing') {
		const targetForm = document.getElementById(formId);
		targetForm.classList.add('active');
		findTickets();
		currentPage = 0;
		return;
	}
    const targetForm = document.getElementById(formId);
    if (targetForm) {
		home.classList.add('active');
        targetForm.classList.add('active');
    } else {
        console.error(`Form with id "${formId}" not found.`);
    }
}

const home = document.getElementById('home-page');
home.classList.add('active');

const button = document.getElementById('menu-button');
const menu = document.getElementById('menu');
let isHovering = false;
button.addEventListener('mouseenter', () => {
    button.classList.add('hover');
    menu.classList.add('active');
	isHovering = true;
});
button.addEventListener('mouseleave', () => {
    isHovering = false;
	setTimeout(() => {
        if (!isHovering) {
			button.classList.remove('hover');
            menu.classList.remove('active');
        }
    }, 50);
});
menu.addEventListener('mouseenter', () => {
    button.classList.add('hover');
    menu.classList.add('active');
	isHovering = true;
});
menu.addEventListener('mouseleave', () => {
    isHovering = false;
	setTimeout(() => {
        if (!isHovering) {
			button.classList.remove('hover');
            menu.classList.remove('active');
        }
    }, 50);
});

const ticketTypeManager = new ObjInfManager('TicketType');
ticketTypeManager.addObj(new TicketType('none', '...'));
ticketTypeManager.addObj(new TicketType('compartment', 'Купе'));
ticketTypeManager.addObj(new TicketType('reserved_seat', 'Плацкарт'));
ticketTypeManager.addObj(new TicketType('unreserved_seat', 'Сидячий'));
ticketTypeManager.addObj(new TicketType('first-class_sleeper', 'СВ'));
ticketTypeManager.getObjs().forEach(item => {
    const option = document.createElement('option');
    option.value = item.Obj.value;
    option.textContent = item.Obj.text;
	selectBox = document.getElementById('type')
    selectBox.appendChild(option);
});

const townManager = new ObjInfManager('Town');
townManager.addAll([
	new Town("none", "..."),
	new Town("Moscow", "Москва"),
	new Town("Saint-Petersburg", "Санкт-Петербург"),
	new Town("Novosibirsk", "Новосибирск"),
	new Town("Yekaterinburg", "Екатеринбург"),
	new Town("Vladivostok", "Владивосток"),
	new Town("Rostov-on-Don", "Ростов-на-Дону"),
	new Town("Krasnoyarsk", "Красноярск"),
	new Town("Volgograd", "Волгоград"),
	new Town("Samara", "Самара"),
	new Town("Ufa", "Уфа")
]);
townManager.getObjs().forEach(item => {
    const option1 = document.createElement('option');
    option1.value = item.Obj.value;
    option1.textContent = item.Obj.text;
	const option2 = document.createElement('option');
	option2.value = item.Obj.value;
    option2.textContent = item.Obj.text;
	selectBox = document.getElementById('start-point')
    selectBox.appendChild(option1);
	selectBox = document.getElementById('finish-point')
    selectBox.appendChild(option2);
});

const ticketManager = new ObjInfManager('Ticket');
ticketManager.addAll([
	new Ticket("Moscow", "Saint-Petersburg", new Date(2024, 11, 27, 6, 20, 0), new Date(2024, 11, 27, 12, 40, 0), 2500, "unreserved_seat", false),
    new Ticket("Novosibirsk", "Yekaterinburg", new Date(2024, 11, 28, 8, 30, 0), new Date(2024, 11, 28, 16, 45, 0), 3200, "reserved_seat", true),
    new Ticket("Vladivostok", "Moscow", new Date(2025, 0, 1, 14, 15, 0), new Date(2025, 0, 3, 9, 10, 0), 12000, "first-class_sleeper", false),
    new Ticket("Samara", "Ufa", new Date(2024, 11, 29, 5, 0, 0), new Date(2024, 11, 29, 7, 45, 0), 1500, "compartment", true),
    new Ticket("Saint-Petersburg", "Krasnoyarsk", new Date(2024, 11, 30, 22, 0, 0), new Date(2025, 0, 1, 7, 0, 0), 7800, "first-class_sleeper", true),
    new Ticket("Yekaterinburg", "Rostov-on-Don", new Date(2024, 11, 31, 10, 20, 0), new Date(2025, 0, 1, 18, 15, 0), 4500, "reserved_seat", false),
    new Ticket("Volgograd", "Samara", new Date(2024, 11, 26, 11, 40, 0), new Date(2024, 11, 26, 15, 0, 0), 2300, "unreserved_seat", true),
    new Ticket("Rostov-on-Don", "Ufa", new Date(2024, 11, 25, 9, 10, 0), new Date(2024, 11, 25, 20, 30, 0), 3800, "compartment", false),
    new Ticket("Krasnoyarsk", "Volgograd", new Date(2024, 11, 24, 12, 0, 0), new Date(2024, 11, 25, 6, 15, 0), 8900, "first-class_sleeper", true),
    new Ticket("Samara", "Saint-Petersburg", new Date(2024, 11, 23, 15, 45, 0), new Date(2024, 11, 24, 12, 0, 0), 5600, "reserved_seat", false),
    new Ticket("Ufa", "Moscow", new Date(2024, 11, 22, 16, 20, 0), new Date(2024, 11, 23, 7, 40, 0), 2900, "unreserved_seat", true),
    new Ticket("Moscow", "Novosibirsk", new Date(2024, 11, 21, 19, 0, 0), new Date(2024, 11, 22, 23, 15, 0), 6700, "compartment", false),
    new Ticket("Saint-Petersburg", "Yekaterinburg", new Date(2024, 11, 20, 18, 15, 0), new Date(2024, 11, 21, 15, 0, 0), 5200, "reserved_seat", true),
    new Ticket("Novosibirsk", "Vladivostok", new Date(2024, 11, 19, 21, 30, 0), new Date(2024, 11, 22, 8, 0, 0), 10500, "first-class_sleeper", false),
    new Ticket("Krasnoyarsk", "Moscow", new Date(2024, 11, 18, 20, 0, 0), new Date(2024, 11, 20, 7, 30, 0), 7800, "compartment", true),
    new Ticket("Volgograd", "Saint-Petersburg", new Date(2024, 11, 17, 10, 20, 0), new Date(2024, 11, 18, 4, 0, 0), 4600, "reserved_seat", false),
    new Ticket("Samara", "Rostov-on-Don", new Date(2024, 11, 16, 8, 30, 0), new Date(2024, 11, 16, 14, 50, 0), 2400, "unreserved_seat", true),
    new Ticket("Ufa", "Krasnoyarsk", new Date(2024, 11, 15, 6, 0, 0), new Date(2024, 11, 16, 22, 0, 0), 6700, "first-class_sleeper", false),
    new Ticket("Rostov-on-Don", "Vladivostok", new Date(2024, 11, 14, 14, 15, 0), new Date(2024, 11, 17, 18, 40, 0), 15000, "compartment", true),
    new Ticket("Moscow", "Volgograd", new Date(2024, 11, 13, 5, 30, 0), new Date(2024, 11, 13, 13, 45, 0), 2100, "reserved_seat", false)
]);

const ticketTemplate = `
    <div class="ticket_background">
        <div class="info_vb">
            <div class="info_container"> 
                <div class="ticket_field">
                    <label for="start-place">Начало:</label>
                    <span class="start-place"></span>
                </div>
                <div class="ticket_field">
                    <label for="end-place">Конец:</label>
                    <span class="end-place"></span>
                </div>
                <div class="ticket_field">
                    <label for="type">Вид билета:</label>
                    <span class="type-field"></span>
                </div>
            </div>
            <div class="info_container">
                <div class="ticket_field">
                    <label for="start-date">Отправление:</label>
                    <span class="start-date"></span>
                </div>
                <div class="ticket_field">
                    <label for="end-date">Прибытие:</label>
                    <span class="end-date"></span>
                </div>
                <div class="ticket_field">
                    <label for="cost">Стоимость:</label>
                    <span class="cost"></span>
                </div>
            </div>
        </div>
    </div>`;

function findTickets() {
	const ticket_properties = {};
	const startPlace = document.getElementById('start-point').value;
	if (startPlace !== 'none') {
		ticket_properties["start_place"] = startPlace;
	}
	const endPlace = document.getElementById('finish-point').value;
	if (endPlace !== 'none') {
		ticket_properties["end_place"] = endPlace;
	}
	const type = document.getElementById('type').value;
	if (type !== 'none') {
		ticket_properties["type"] = type;
	}
	const startDate = document.getElementById('input_date_start').value;
	if (startDate !== '') {
		ticket_properties["start_date"] = new Date(startDate);
	}
	const endDate = document.getElementById('input_date_finish').value;
	if (endDate !== '') {
		ticket_properties["finish_date"] = new Date(endDate);
	}
	const minCost = document.getElementById('input_price_min').value;
	if (minCost !== '') {
		ticket_properties["min_cost"] = minCost;
	}
	const maxCost = document.getElementById('input_price_max').value;
	if (maxCost !== '') {
		ticket_properties["max_cost"] = maxCost;
	}
	ticket_properties['purchased'] = false;
	filteredTickets = ticketManager.getObjs(0, 0, ticket_properties);
	console.log(filteredTickets);
	renderTickets(filteredTickets.slice(0, Math.min(3, filteredTickets.length)));
}

function renderTickets(tickets) {
	const ticketsContainer = document.getElementById('ticket_container');
    ticketsContainer.innerHTML = '';
    const ticketsToRender = tickets.slice(0, 3);
    ticketsToRender.forEach(ticket => {
        const ticketElement = document.createElement('div');
        ticketElement.innerHTML = ticketTemplate;
        ticketElement.querySelector('.start-place').textContent = townManager.getObjByValue(ticket.Obj.start_place).Obj.text;
        ticketElement.querySelector('.end-place').textContent = townManager.getObjByValue(ticket.Obj.end_place).Obj.text;
        ticketElement.querySelector('.type-field').textContent = ticketTypeManager.getObjByValue(ticket.Obj.type).Obj.text;
        ticketElement.querySelector('.start-date').textContent = ticket.Obj.start_date.toLocaleDateString(
		'ru-RU', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
				});
        ticketElement.querySelector('.end-date').textContent = ticket.Obj.finish_date.toLocaleDateString(
		'ru-RU', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
				});
        ticketElement.querySelector('.cost').textContent = ticket.Obj.cost + ' ₽';
        ticketsContainer.appendChild(ticketElement);
    });
}

function prev_page() {
	currentPage = currentPage - 1;
	new_start = currentPage * 3;
	if (new_start < 0) {
		currentPage = Math.floor((filteredTickets.length - 1) / 3);
		new_start = currentPage * 3;
		renderTickets(filteredTickets.slice(new_start, Math.min(new_start + 3, filteredTickets.length)));
	} else {
		renderTickets(filteredTickets.slice(new_start, Math.min(new_start + 3, filteredTickets.length)));
	}
}

function next_page() {
	currentPage = currentPage + 1;
	new_start = currentPage * 3;
	if (new_start >= filteredTickets.length) {
		renderTickets(filteredTickets.slice(0, Math.min(3, filteredTickets.length)));
		currentPage = 0;
	} else {
		renderTickets(filteredTickets.slice(new_start, Math.min(new_start + 3, filteredTickets.length)));
	}
}