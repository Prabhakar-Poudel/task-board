const firebase = window.firebase;

const firestore = window.firebase.firestore();

const listType = {
	'TO_DO': 'TO_DO',
	'IN_PROGRESS': 'IN_PROGRESS',
	'DONE': 'DONE'
};

export { firebase, firestore, listType };
