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
		this.addExpensesBtn = document.getElementById('add-expenses-btn');
		this.totalBalance = document.getElementById('total-balance');
		this.totalIncome = document.getElementById('total-income');
		this.totalExpenses = document.getElementById('total-expenses');
		this.incomeList = document.querySelector('.income-list');
		this.expensesList = document.querySelector('.expenses-list');
		this.editing = false;
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
		if (this.editing === true) return;
		console.log(this.editing)

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
			console.log('added')
			this.savedIncome.push(incomeObj);
			this.ID++;

			this.incomeInputText.value = '';
			this.incomeInputNumber.value = '';
			this.showIncome(this.savedIncome, incomeObj.ID);
			this.saveToLocalStorage('income', this.savedIncome);
			this.calcBalance();
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

		if (this.editing === true) {
			return;
		}

		if (!this.expensesInputText.value || !this.expensesInputNumber.value) {
			this.declineItemAdding(e);
		} else {
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
			this.calcBalance();			
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

	calcBalance() {
		const totalIncomeValue = this.savedIncome.reduce((acc, curr) => {
			acc += parseInt(curr.value);
			return acc;
		}, 0);
	
		const totalExpensesValue = this.savedExpenses.reduce((acc, curr) => {
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

		this.totalBalance.innerText = totalBalanceValue;
		this.totalExpenses.innerText = totalExpensesValue;
		this.totalIncome.innerText = totalIncomeValue;
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
		} else {
			itemToDeleteFromLocalStorage = this.getExpensesFromLocalStorage().find(item => item.ID === ID);
			const newList = this.getExpensesFromLocalStorage().reduce((acc, curr) => {
				if (curr.ID !== ID) {
					acc.push(curr);
				}
				return acc;
			}, [])
			this.saveToLocalStorage('expenses', newList);
		}
		this.calcBalance();
		listToDeleteFrom.removeChild(itemToDelete);
	}

	editItem(itemToEdit, ID, listToDeleteFrom) {
		this.editing = true;
		let itemToEditInLocalStorage;
		if (this.getIncomeFromLocalStorage().find(item => item.ID === ID)) {
			console.log(ID);
			itemToEditInLocalStorage = this.getIncomeFromLocalStorage().find(item => item.ID === ID);
			const editedItemIndex = this.getIncomeFromLocalStorage().indexOf(itemToEditInLocalStorage);
			const { title, value } = itemToEditInLocalStorage;
			this.incomeInputText.value = title;
			this.incomeInputNumber.value = value;
			const editedItemNewTitle = this.incomeInputText.value;
			const editedItemNewNumber = this.incomeInputNumber.value;
			this.addIncomeBtn.addEventListener('click', () => {
				const editedItem = {
					title: editedItemNewTitle,
					value: editedItemNewNumber,
					ID: ID
				}
				const newList = this.getIncomeFromLocalStorage().reduce((acc, curr) => {
					if (parseInt(curr.ID) !== ID) {
						console.log('current ID is ' + curr.ID + ' and ID is ' + ID)
						acc.push(curr)
					}
					return acc;
				}, [])
				this.saveToLocalStorage('income', newList);
			})
		} else {
			itemToEditInLocalStorage = this.getExpensesFromLocalStorage().find(item => item.ID === ID);
			const editedItemIndex = this.getExpensesFromLocalStorage().indexOf(itemToEditInLocalStorage);
			const { title, value } = itemToEditInLocalStorage;
			this.expensesInputText.value = title;
			this.expensesInputNumber.value = value;
			this.addIncomeBtn.addEventListener('click', () => {
				const editedItem = {
					title: this.expensesInputText.value,
					value: this.expensesInputNumber.value,
					ID
				}
				const newList = this.getExpensesFromLocalStorage().splice(editedItemIndex, 1, editedItem);
				this.saveToLocalStorage('expenses', newList);
			})
		}
		this.calcBalance();
		this.editing = false;
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
			this.calcBalance();
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
			const itemToEdit = e.target.parentElement.parentElement.parentElement;
			const ID = parseInt(itemToEdit.firstElementChild.dataset.id);
			const listToDeleteFrom = itemToEdit.parentElement;
			budgetApp.editItem(itemToEdit, ID, listToDeleteFrom);
		} else if (e.target.classList.contains('edit-btn')) {
			const itemToEdit = e.target.parentElement.parentElement;
			const ID = parseInt(itemToEdit.firstElementChild.dataset.id);
			const listToDeleteFrom = itemToEdit.parentElement;
			budgetApp.editItem(itemToEdit, ID, listToDeleteFrom);
		}
	})
})