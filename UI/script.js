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

class Validator {
	static validateFIO(FIO) {
		const FIORegex = /^[A-Za-zА-яа-я]+$/;
		const parts = FIO.split(' ');
		let isValid = true;
		parts.forEach(part => {
			if (isValid) { 
			isValid = FIORegex.test(part)
			}
		})
		return isValid && parts.length === 3;
	}
	static validatePassport(passport) {
		const passportRegex = /^[A-Za-z]{2}\d{7}$/;
		return passportRegex.test(passport.trim());
	}
	static validateEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email.trim());
	}
	static validatePassword(password) {
		return password.trim().length >= 8;
	}
	static validatePasswordRepeat(password, password_repeat) {
		return password_repeat === password;
	}
}

class ViewModel {
	#currentPage;
	#filteredTickets;
	#ticketManager;
	#townManager;
	#ticketTypeManager;
	#isAutorized;
	
	constructor() {
		const home = document.getElementById('home-page');
		home.classList.add('active');
		this.#ticketTypeManager = new ObjInfManager('TicketType');
		this.#townManager = new ObjInfManager('Town');
		this.#ticketManager = new ObjInfManager('Ticket');
	}
		
	save() {
		const tickets = this.#ticketManager.getObjs().map(ticket => ({
			start_place: ticket.Obj.start_place,
			end_place: ticket.Obj.end_place,
			start_date: ticket.Obj.start_date.toISOString(),
			finish_date: ticket.Obj.finish_date.toISOString(),
			cost: ticket.Obj.cost,
			type: ticket.Obj.type,
			purchased: ticket.Obj.purchased,
		}));
		localStorage.setItem('tickets', JSON.stringify(tickets));
		
		const towns = this.#townManager.getObjs().map(town => ({
			value: town.Obj.value,
			text: town.Obj.text,
		}));
		localStorage.setItem('towns', JSON.stringify(towns));
		
		const ticketTypes = this.#ticketTypeManager.getObjs().map(ticketType => ({
			value: ticketType.Obj.value,
			text: ticketType.Obj.text,
		}));
		localStorage.setItem('ticketTypes', JSON.stringify(ticketTypes));

		localStorage.setItem('isAutorized', this.#isAutorized);
	}
	
	restore() {
		const storedTicketTypes = JSON.parse(localStorage.getItem('ticketTypes'));
		storedTicketTypes.forEach(({ value, text }) => this.#ticketTypeManager.addObj(new TicketType(value, text)));
		this.#ticketTypeManager.getObjs().forEach(item => {
			const option = document.createElement('option');
			option.value = item.Obj.value;
			option.textContent = item.Obj.text;
			let selectBox = document.getElementById('type');
			selectBox.appendChild(option);
		});
		const storedTowns = JSON.parse(localStorage.getItem('towns'));
		storedTowns.forEach(({ value, text }) => this.#townManager.addObj(new Town(value, text)));
		this.#townManager.getObjs().forEach(item => {
			const option1 = document.createElement('option');
			option1.value = item.Obj.value;
			option1.textContent = item.Obj.text;
			const option2 = document.createElement('option');
			option2.value = item.Obj.value;
			option2.textContent = item.Obj.text;
			let selectBox = document.getElementById('start-point');
			selectBox.appendChild(option1);
			selectBox = document.getElementById('finish-point');
			selectBox.appendChild(option2);
		});
		const storedTickets = JSON.parse(localStorage.getItem('tickets'));
		storedTickets.forEach(({ 
			start_place, 
			end_place, 
			start_date, 
			finish_date, 
			cost, 
			type, 
			purchased 
		}) => this.#ticketManager.addObj(
											new Ticket(
													start_place, 
													end_place, 
													new Date(start_date), 
													new Date(finish_date), 
													cost, 
													type, 
													purchased,
												)));
		this.#isAutorized = JSON.parse(localStorage.getItem('isAutorized'));
		const header = document.getElementById('header-view-home');
		if (this.#isAutorized) {
			header.innerHTML = this.autorizedTemplate;
		} else {
			header.innerHTML = this.unautorizedTemplate;
		}
		this.#restoreMenuButton();
	}
	
	navigateTo(formId) {
		document.querySelectorAll('.form').forEach(form => {
			form.classList.remove('active');
		});
		const home = document.getElementById('home-page');
		if (formId === 'home-page') {
			const header = document.getElementById('header-view-browsing');
			header.innerHTML = '';
			const header_home = document.getElementById('header-view-home');
			if (this.#isAutorized) {
				header_home.innerHTML = this.autorizedTemplate;
			} else {
				header_home.innerHTML = this.unautorizedTemplate;
			}
			this.#restoreMenuButton();
			home.classList.add('active');
			return;
		}
		if (formId === 'browsing') {
			const header = document.getElementById('header-view-home');
			header.innerHTML = '';
			const header_browsing = document.getElementById('header-view-browsing');
			if (this.#isAutorized) {
				header_browsing.innerHTML = this.autorizedTemplate;
			} else {
				header_browsing.innerHTML = this.unautorizedTemplate;
			}
			this.#restoreMenuButton();
			const targetForm = document.getElementById(formId);
			targetForm.classList.add('active');
			this.#currentPage = 0;
			this.#findTickets();
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
	
	ticketTemplate = `
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
	
	#findTickets() {
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
		this.#filteredTickets = this.#ticketManager.getObjs(0, 0, ticket_properties);
		this.#renderTickets(this.#filteredTickets.slice(0, Math.min(3, this.#filteredTickets.length)));
	}

	#renderTickets(tickets) {
		const ticketsContainer = document.getElementById('ticket_container');
		ticketsContainer.innerHTML = '';
		const ticketsToRender = tickets.slice(0, 3);
		ticketsToRender.forEach(ticket => {
			const ticketElement = document.createElement('div');
			ticketElement.innerHTML = this.ticketTemplate;
			ticketElement.querySelector('.start-place').textContent = this.#townManager.getObjByValue(ticket.Obj.start_place).Obj.text;
			ticketElement.querySelector('.end-place').textContent = this.#townManager.getObjByValue(ticket.Obj.end_place).Obj.text;
			ticketElement.querySelector('.type-field').textContent = this.#ticketTypeManager.getObjByValue(ticket.Obj.type).Obj.text;
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

	prevPage() {
		this.#currentPage = this.#currentPage - 1;
		let new_start = this.#currentPage * 3;
		if (new_start < 0) {
			this.#currentPage = Math.floor((this.#filteredTickets.length - 1) / 3);
			new_start = this.#currentPage * 3;
			this.#renderTickets(this.#filteredTickets.slice(new_start, Math.min(new_start + 3, this.#filteredTickets.length)));
		} else {
			this.#renderTickets(this.#filteredTickets.slice(new_start, Math.min(new_start + 3, this.#filteredTickets.length)));
		}
	}

	nextPage() {
		this.#currentPage = this.#currentPage + 1;
		let new_start = this.#currentPage * 3;
		if (new_start >= this.#filteredTickets.length) {
			this.#renderTickets(this.#filteredTickets.slice(0, Math.min(3, this.#filteredTickets.length)));
			this.#currentPage = 0;
		} else {
			this.#renderTickets(this.#filteredTickets.slice(new_start, Math.min(new_start + 3, this.#filteredTickets.length)));
		}
	}
	
	#restoreMenuButton() {
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
	}
	
	exit() {
		this.#isAutorized = false;
		localStorage.setItem('isAutorized', this.#isAutorized);
		const header = document.getElementById('header-view-home');
		header.innerHTML = this.unautorizedTemplate;
		this.#restoreMenuButton();
		document.querySelectorAll('input').forEach(input => {
			input.value = '';
		});
		document.querySelectorAll('select').forEach(select => {
			select.selectedIndex = 0;
		});
		this.navigateTo('home-page');
	}
	
	logIn() {
		const email = document.getElementById('login');
		let isMistake = false;
		if (email.value === '' || !Validator.validateEmail(email.value)) {
			email.style.border = '2px solid red';
			isMistake = true;
		} else {
			email.style.border = '2px solid green';
		}
		const password = document.getElementById('login-password');
		if (password.value === '' || !Validator.validatePassword(password.value)) {
			password.style.border = '2px solid red';
			isMistake = true;
		}
		if (isMistake) {
			return;
		}
		if (localStorage.getItem(email.value) != password.value) {
			password.style.border = '2px solid red';
			return;
		}
		email.style.border = 'none';
		email.value = '';
		password.style.border = 'none';
		password.value = '';
		this.#isAutorized = true;
		localStorage.setItem('isAutorized', this.#isAutorized);
		const header = document.getElementById('header-view-home');
		header.innerHTML = this.autorizedTemplate;
		this.#restoreMenuButton();
		this.navigateTo('home-page');
	}
	
	signIn() {
		const FIO = document.getElementById('FIO');
		let isMistake = false;
		if (FIO.value === '' || !Validator.validateFIO(FIO.value)) {
			FIO.style.border = '2px solid red';
			isMistake = true;
		} else {
			FIO.style.border = '2px solid green';
		}
		const passport = document.getElementById('passport');
		if (passport.value === '' || !Validator.validatePassport(passport.value)) {
			passport.style.border = '2px solid red';
			isMistake = true;
		} else {
			passport.style.border = '2px solid green';
		}
		const email = document.getElementById('e-mail');
		if (email.value === '' || !Validator.validateEmail(email.value)) {
			email.style.border = '2px solid red';
			isMistake = true;
		} else {
			email.style.border = '2px solid green';
		}
		const password = document.getElementById('password');
		if (password.value === '' || !Validator.validatePassword(password.value)) {
			password.style.border = '2px solid red';
			isMistake = true;
		} else {
			password.style.border = '2px solid green';
		}
		const password_repeat = document.getElementById('password-repeat');
		if (password_repeat.value === '' || !Validator.validatePasswordRepeat(password.value, password_repeat.value)) {
			password_repeat.style.border = '2px solid red';
			isMistake = true;
		} else {
			password_repeat.style.border = '2px solid green';
		}
		if (isMistake) {
			return;
		}
		FIO.style.border = 'none';
		FIO.value = '';
		passport.style.border = 'none';
		passport.value = '';
		email.style.border = 'none';
		email.value = '';
		password.style.border = 'none';
		password.value = '';
		password_repeat.style.border = 'none';
		password_repeat.value = '';
		if (localStorage.getItem(email.value) != null) {
			document.getElementById('login').value = email.value;
			this.navigateTo('log-in');
			return;
		}
		localStorage.setItem(email.value, password.value);
		this.#isAutorized = true;
		localStorage.setItem('isAutorized', this.#isAutorized);
		const header = document.getElementById('header-view-home');
		header.innerHTML = this.autorizedTemplate;
		this.#restoreMenuButton();
		this.navigateTo('home-page');
	}
	
	unautorizedTemplate = `
    <button onclick="viewModel.navigateTo('log-in')" class="log_in_button">Вход</button> 
	<button onclick="viewModel.navigateTo('sign-in')" class="sign_in_button">Регистрация</button> 
	<button id="menu-button" class="menu_button">Меню</button>
	<div class="header_underline"></div>
	<img onclick="viewModel.navigateTo('home-page')" class="logo_icon" alt="Company logo" src="resources/Logo.png">
	<img class="log_in_icon" alt="Log in icon" src="resources/Log in.png">
	<img class="sign_in_icon" alt="Sign in icon" src="resources/Sign in.png">`;
	
	autorizedTemplate = `
    <button onclick="viewModel.exit()" class="log_out_button">Выход</button>
	<button id="menu-button" class="menu_button">Меню</button>
	<div class="header_underline"></div>
	<img onclick="viewModel.navigateTo('home-page')" class="logo_icon" alt="Company logo" src="resources/Logo.png">
	<img class="log_out_icon" alt="Log in icon" src="resources/Log out.png">`;
}

viewModel = new ViewModel();
viewModel.restore();
