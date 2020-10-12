class App {
	constructor() {
		this.savedIncome = this.getIncomeFromLocalStorage() || [];
		this.savedExpenses = this.getExpensesFromLocalStorage() || [];
		this.ID = this.getID();
		this.incomeInputText = document.getElementById('income-input-text');
		this.expensesInputText = document.getElementById('expenses-input-text');
		this.incomeInputNumber = document.getElementById('income-input-number');
		this.expensesInputNumber = document.getElementById('expenses-input-number');
		this.addIncomeBtn = document.getElementById('add-income-btn');
		this.editIncomeBtn = document.getElementById('edit-income-btn');
		this.addExpensesBtn = document.getElementById('add-expenses-btn');
		this.editExpensesBtn = document.getElementById('edit-expenses-btn');
		this.totalBalance = document.getElementById('total-balance');
		this.totalIncome = document.getElementById('total-income');
		this.totalExpenses = document.getElementById('total-expenses');
		this.incomeList = document.querySelector('.income-list');
		this.expensesList = document.querySelector('.expenses-list');
	}

	getID() {
		if (!this.getIncomeFromLocalStorage() && !this.getExpensesFromLocalStorage()) {
			return 0;
		} else if (this.getIncomeFromLocalStorage() && !this.getExpensesFromLocalStorage()) {
			return this.getIncomeFromLocalStorage().length;
		} else if (!this.getIncomeFromLocalStorage() && this.getExpensesFromLocalStorage()) {
			return this.getExpensesFromLocalStorage().length;
		} else {
			return this.getIncomeFromLocalStorage().concat(this.getExpensesFromLocalStorage()).length;
		}
	}

	addIncome(e) {
		e.preventDefault();

		if (!this.incomeInputText.value || (!this.incomeInputNumber.value || this.incomeInputNumber <= 0)) {
			this.declineItemAdding(e);
		} else {
			const incomeTitle = this.incomeInputText.value;
			const incomeValue = this.incomeInputNumber.value;
			const incomeObj = {
				title: incomeTitle,
				value: incomeValue,
				ID: this.ID
				};
			this.savedIncome.push(incomeObj);
			this.ID++;

			this.incomeInputText.value = '';
			this.incomeInputNumber.value = '';
			this.showIncome(this.savedIncome, incomeObj.ID);
			this.saveToLocalStorage('income', this.savedIncome);
			this.calcBalance(this.getIncomeFromLocalStorage(), this.getExpensesFromLocalStorage());
		}
	}

	showIncome(array, ID) {
		const itemsInHTML = array.map(item => {
			return `
			<div class="item">
			<div class="item-info" data-id="${item.ID}">
				<p class="item-title">${item.title}</p>
				<div class="item-value">$${item.value}</div>
			</div>
			<div class="item-btn-container">
				<button class="edit-btn">
					<i class="fas fa-edit"></i>
				</button>
				<button class="delete-btn">&times;</button>
			</div>
			</div>
		`
		})
		this.incomeList.innerHTML += itemsInHTML[itemsInHTML.length - 1];
	}

	addExpenses(e) {
		e.preventDefault();

		if (!this.expensesInputText.value || !this.expensesInputNumber.value) {
			this.declineItemAdding(e);
		} else {
			if (this.addIncomeBtn.textContent === 'Edit Income') {
				console.log('fuck you');
				return;
			} else if (this.addIncomeBtn.textContent === 'Add Income') {				
				const expensesTitle = this.expensesInputText.value;
				const expensesValue = this.expensesInputNumber.value;
				const expensesObj = {
					title: expensesTitle,
					value: expensesValue,
					ID: this.ID
				}
				this.savedExpenses.push(expensesObj);
				this.ID++;

				this.expensesInputText.value = '';
				this.expensesInputNumber.value = '';
				this.showExpenses(this.savedExpenses, expensesObj.ID);
				this.saveToLocalStorage('expenses', this.savedExpenses);
				this.calcBalance(this.getIncomeFromLocalStorage(), this.getExpensesFromLocalStorage());			
			}
		}	
	}

	showExpenses(array, ID) {
		const itemsInHTML = array.map(item => {
			return `
			<div class="item">
				<div class="item-info" data-id="${item.ID}">
					<p class="item-title">${item.title}</p>
					<div class="item-value">$${item.value}</div>
				</div>
				<div class="item-btn-container">
					<button class="edit-btn">
						<i class="fas fa-edit"></i>
					</button>
					<button class="delete-btn">&times;</button>
				</div>
			<div>
			`
		})
		this.expensesList.innerHTML += itemsInHTML[itemsInHTML.length - 1];
	}

	calcBalance(incomeArray, expensesArray) {
		const totalIncomeValue = incomeArray.reduce((acc, curr) => {
			acc += parseInt(curr.value);
			return acc;
		}, 0);
	
		const totalExpensesValue = expensesArray.reduce((acc, curr) => {
			acc += parseInt(curr.value);
			return acc;
		}, 0);

		const totalBalanceValue = totalIncomeValue - totalExpensesValue;

		if (totalBalanceValue < 0) {
			this.totalBalance.classList.remove('negative-balance');
			this.totalBalance.classList.remove('positive-balance');
			this.totalBalance.classList.add('negative-balance');
		} else if (totalBalanceValue > 0) {
			this.totalBalance.classList.remove('negative-balance');
			this.totalBalance.classList.remove('positive-balance');
			this.totalBalance.classList.add('positive-balance');
		} else {
			this.totalBalance.className = '';
		}

		this.totalBalance.textContent = totalBalanceValue;
		document.getElementById('total-expenses').textContent = totalExpensesValue;
		document.getElementById('total-income').textContent = totalIncomeValue;
	}

	declineItemAdding(e) {
		const cardSymbolContainer = e.target.parentElement.parentElement.firstElementChild;
		const cardSymbol = e.target.parentElement.parentElement.firstElementChild.firstElementChild;
		cardSymbolContainer.classList.add('show-error-background');
		cardSymbol.classList.add('show-error-animation');
		setTimeout(() => {
			cardSymbolContainer.classList.remove('show-error-background');
			cardSymbol.classList.remove('show-error-animation');
		}, 2000)
	}

	deleteItem(e) {
		const itemToDelete = e.target.parentElement.parentElement;
		const ID = parseInt(itemToDelete.firstElementChild.dataset.id);
		const listToDeleteFrom = itemToDelete.parentElement;

		let itemToDeleteFromLocalStorage;

		if (this.getIncomeFromLocalStorage().find(item => item.ID === ID)) {
			itemToDeleteFromLocalStorage = this.getIncomeFromLocalStorage().find(item => item.ID === ID);
			const newList = this.getIncomeFromLocalStorage().reduce((acc, curr) => {
				if (curr.ID !== ID) {
					acc.push(curr);
				}
				return acc;
			}, [])
			this.saveToLocalStorage('income', newList);
			this.calcBalance(this.getIncomeFromLocalStorage(), this.getExpensesFromLocalStorage())
		} else {
			itemToDeleteFromLocalStorage = this.getExpensesFromLocalStorage().find(item => item.ID === ID);
			const newList = this.getExpensesFromLocalStorage().reduce((acc, curr) => {
				if (curr.ID !== ID) {
					acc.push(curr);
				}
				return acc;
			}, [])
			this.saveToLocalStorage('expenses', newList);
			this.calcBalance(this.getIncomeFromLocalStorage(), this.getExpensesFromLocalStorage())
		}
		listToDeleteFrom.removeChild(itemToDelete);
	}

	editItem(itemToEdit, ID) {
		let itemToEditInLocalStorage;
		if (this.getIncomeFromLocalStorage().find(item => item.ID === ID)) {
			this.addIncomeBtn.classList.add('hide-btn');
			this.editIncomeBtn.classList.remove('hide-btn');
			itemToEditInLocalStorage = this.getIncomeFromLocalStorage().find(item => item.ID === ID);
			const editedItemIndex = this.getIncomeFromLocalStorage().findIndex(i => i.ID === ID);
			const { title, value } = itemToEditInLocalStorage;
			this.incomeInputText.value = title;
			this.incomeInputNumber.value = value;
			this.editIncomeBtn.addEventListener('click', e => {
				e.preventDefault();
				if (!this.incomeInputText.value || (!this.incomeInputNumber.value || this.incomeInputNumber <= 0)) {
					this.declineItemAdding(e);
				} else {
					const editedTitle = this.incomeInputText.value;
					const editedValue = this.incomeInputNumber.value;
					const editedItem = {
						title: editedTitle,
						value: editedValue,
						ID
					}
					this.saveToLocalStorage('income', this.getIncomeFromLocalStorage().map(item => item.ID === ID ? editedItem : item));
					itemToEdit.children[0].children[0].innerText = editedTitle;
					itemToEdit.children[0].children[1].innerText = '$' + editedValue;
					ID = '';
					itemToEdit = '';
					this.incomeInputText.value = '';
					this.incomeInputNumber.value = '';
					this.editIncomeBtn.classList.add('hide-btn');
					this.addIncomeBtn.classList.remove('hide-btn');
					this.calcBalance(this.getIncomeFromLocalStorage(), this.getExpensesFromLocalStorage());
				}
			})
		} else {
			itemToEditInLocalStorage = this.getExpensesFromLocalStorage().find(item => item.ID === ID);
			this.addExpensesBtn.classList.add('hide-btn');
			this.editExpensesBtn.classList.remove('hide-btn');
			const { title, value } = itemToEditInLocalStorage;
			this.expensesInputText.value = title;
			this.expensesInputNumber.value = value;
			this.editExpensesBtn.addEventListener('click', (e) => {
				e.preventDefault();
				if (!this.expensesInputText.value || (this.expensesInputNumber.value < 0 || !this.expensesInputNumber.value)) {
					this.declineItemAdding(e)
				} else {
					const editedTitle = this.expensesInputText.value;
					const editedValue = this.expensesInputNumber.value;
					const editedItem = {
						title: editedTitle,
						value: editedValue,
						ID
					}
					this.saveToLocalStorage('expenses', this.getExpensesFromLocalStorage().map(item => item.ID === ID ? editedItem : item));
					itemToEdit.children[0].children[0].innerText = editedTitle;
					itemToEdit.children[0].children[1].innerText = '$' + editedValue;
					ID = '';
					itemToEdit = '';
					this.expensesInputText.value = '';
					this.expensesInputNumber.value = '';
					this.editExpensesBtn.classList.add('hide-btn');
					this.addExpensesBtn.classList.remove('hide-btn');
					this.calcBalance(this.getIncomeFromLocalStorage(), this.getExpensesFromLocalStorage());
				}
			})
		}
	}

	saveToLocalStorage(type, itemArray) {
		localStorage.setItem(type, JSON.stringify(itemArray));
	}

	getIncomeFromLocalStorage() {
		return JSON.parse(localStorage.getItem('income'));
	}

	getExpensesFromLocalStorage() {
		return JSON.parse(localStorage.getItem('expenses'));
	}

	showOnLoad() {
		if (!this.getIncomeFromLocalStorage() && !this.getExpensesFromLocalStorage()) {
			return;
		} else {
			if (this.getIncomeFromLocalStorage()) {
				const incomeItemsInHTML = this.getIncomeFromLocalStorage()
				.map(item => {
					return `
				<div class="item-info" data-id="${item.ID}">
					<p class="item-title">${item.title}</p>
					<div class="item-value">$${item.value}</div>
				</div>
				<div class="item-btn-container">
					<button class="edit-btn">
						<i class="fas fa-edit"></i>
					</button>
					<button class="delete-btn">&times;</button>
				</div>
				`
			})
			incomeItemsInHTML.forEach(item => {
				const itemDiv = document.createElement('div');
				itemDiv.classList.add('item');
				itemDiv.innerHTML = item;
				this.incomeList.appendChild(itemDiv);
			})
			}
			if (this.getExpensesFromLocalStorage()) {				
				const expensesItemsInHTML = this.getExpensesFromLocalStorage()
				.map(item => {
					return `
				<div class="item-info" data-id="${item.ID}">
					<p class="item-title">${item.title}</p>
					<div class="item-value">$${item.value}</div>
				</div>
				<div class="item-btn-container">
					<button class="edit-btn">
						<i class="fas fa-edit"></i>
					</button>
					<button class="delete-btn">&times;</button>
				</div>
				`
				})
				expensesItemsInHTML.forEach(item => {
					const itemDiv = document.createElement('div');
					itemDiv.classList.add('item');
					itemDiv.innerHTML = item;
					this.expensesList.appendChild(itemDiv);
				})
			}
			this.calcBalance(this.getIncomeFromLocalStorage(), this.getExpensesFromLocalStorage());
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const budgetApp = new App();
	budgetApp.showOnLoad();
	budgetApp.addIncomeBtn.addEventListener('click', (e) => {
		budgetApp.addIncome(e);
	})
	budgetApp.addExpensesBtn.addEventListener('click', (e) => {
		budgetApp.addExpenses(e);
	})
	budgetApp.incomeList.addEventListener('click', (e) => {
		if (e.target.classList.contains('delete-btn')) {
			budgetApp.deleteItem(e);
		}
	})
	budgetApp.expensesList.addEventListener('click', (e) => {
		if (e.target.classList.contains('delete-btn')) {
			budgetApp.deleteItem(e);
		}
	})
	budgetApp.incomeList.addEventListener('click', (e) => {
		if (e.target.classList.contains('fa-edit')) {
			let itemToEdit = e.target.parentElement.parentElement.parentElement;
			let ID = parseInt(itemToEdit.firstElementChild.dataset.id);
			budgetApp.editItem(itemToEdit, ID);
		} else if (e.target.classList.contains('edit-btn')) {
			let itemToEdit = e.target.parentElement.parentElement;
			let ID = parseInt(itemToEdit.firstElementChild.dataset.id);
			budgetApp.editItem(itemToEdit, ID);
		}
	})
	budgetApp.expensesList.addEventListener('click', (e) => {
		if (e.target.classList.contains('fa-edit')) {
			let itemToEdit = e.target.parentElement.parentElement.parentElement;
			let ID = parseInt(itemToEdit.firstElementChild.dataset.id);
			budgetApp.editItem(itemToEdit, ID);
		} else if (e.target.classList.contains('edit-btn')) {
			let itemToEdit = e.target.parentElement.parentElement;
			let ID = parseInt(itemToEdit.firstElementChild.dataset.id);
			budgetApp.editItem(itemToEdit, ID);
		}
	})
})