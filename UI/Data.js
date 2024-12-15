ticketTypeManager = new ObjInfManager('TicketType');
ticketTypeManager.addObj(new TicketType('none', '...'));
ticketTypeManager.addObj(new TicketType('compartment', 'Купе'));
ticketTypeManager.addObj(new TicketType('reserved_seat', 'Плацкарт'));
ticketTypeManager.addObj(new TicketType('unreserved_seat', 'Сидячий'));
ticketTypeManager.addObj(new TicketType('first-class_sleeper', 'СВ'));
const ticketTypes = this.#ticketTypeManager.getObjs().map(ticketType => ({
	value: ticketType.Obj.value,
	text: ticketType.Obj.text,
}));
localStorage.setItem('ticketTypes', JSON.stringify(ticketTypes));
		
townManager = new ObjInfManager('Town');
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
const towns = this.#townManager.getObjs().map(town => ({
	value: town.Obj.value,
	text: town.Obj.text,
}));
localStorage.setItem('towns', JSON.stringify(towns));

ticketManager = new ObjInfManager('Ticket');
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
localStorage.setItem('isAutorized', false);