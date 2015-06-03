// var mongoose = require('mongoose'),
//     ReciepModel = models.Reciep;
//     // UsersModel = models.Users,
//     // ListsModel = models.Lists,
//     // ListFieldsModel = models.ListFields,
//     // ListItemsModel = models.ListItems,
//     // logOn = false;

// //createUsers();

// // removeAll();

// function createUsers() {
//     if (logOn) console.log('Create users.');

//     findAllAtModel(UsersModel, function(result) {
//         if (result) {
//             if (logOn) console.log('Users is not empty.');

//             createLists(result[0]);
//         }
//         else {
//             if (logOn) console.log('Users model is empty.');

//             UsersModel.create({
//                 login: 'aaaaa',
//                 email: 'aaaa',
//                 password: 'aaaaa',
//                 firstName: 'Test',
//                 lastName: 'User',
//                 isVerified: true
//             }, function(err, user) {
//                 if (err) console.error(err);
//                 else createLists(user);
//             });
//         }
//     });
// }

// function createLists(user) {
//     var i = 0;

//     if (logOn) console.log('Create lists.');

//     findAllAtModel(ListsModel, function(result) {
//         if (result) {
//             if (logOn) console.log('Lists model is not empty.');

//             logResults();
//         }
//         else {
//             if (logOn) console.log('Lists model is empty.');

//             i++;

//             var cf1 = new ListFieldsModel({
//                 label: "Text Custom Field",
//                 type: "Text",
//                 fieldOptions:{
//                     minlength: 1,
//                     maxlength: 50,
//                     placeholder: "placeholder"
//                 }
//             });

//             ListsModel.create({
//                 uid: user._id,
//                 title: 'Many Items List',
//                 description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using "Content here, content here", making it look like readable English.',
//                 customFields: [cf1]
//             }, function(err, list) {
//                 if (err) console.error(err);
//                 else createItems(list);

//                 /*cf1.save(function(err, customField) {
//                     list.customFields.push(customField);
//                     list.save();
//                 });*/

//                 i--;
//                 if (!i) logResults();
//             });

//             i++;
//             ListsModel.create({
//                 uid: user._id,
//                 title: 'Test List 2',
//                 description: 'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for "lorem ipsum" will uncover many web sites still in their infancy. Various versions have  evolved over the years, sometimes by accident, sometimes on purpose  (injected humour and the like).',
//                 customFields: []
//             }, function(err, list) {
//                 if (err) console.error(err);

//                 i--;
//                 if (!i) logResults();
//             });
//         }
//     });
// }

// function createItems(list) {
//     findAllAtModel (ListItemsModel, function(result) {
//         if (result) {
//             if (logOn) console.log("List items already exists.");

//         } else {
//             var words = ["Some", "Title", "Item", "Cat", "Dog", "Eat", "Strawberry", "Meat", "Tiger", "PS3", "iPhone", "Fly", "Stimorol", "Orbit", "Chiken", "Milk", "Lorem", "Kant", "Freid", "Bear",
//                             "Alligator", "Paint", "Tree", "Goes", "Left", "Up", "Very", "Nice", "Subtitle", "Cow", "Bull", "Quote", "Bounty", "Mars", "Jupiter", "Azimov", "Bredbury", "Clurk", "Lee",
//                             "White", "Pifagor", "Math", "Kant", "Lenin", "Read", "Nice", "Terrible", "Rainbow", "Farenheit", "and", "a", "so", "Much", "or", "if", "then", "crowd", "IT",
//                                 "Apple", "Microsoft", "Japan", "Military", "Peace", "go"];
//             var genTitle = function(wordsCount) {
//                 var res = "";
//                 var count = wordsCount || Math.floor((Math.random()*6) + 1);
//                 while (count != 0) {
//                     var ind = Math.floor((Math.random() * words.length) + 1) - 1;
//                     res += words[ind];
//                     if (res.length > 0) res += " ";
//                     count--;
//                 }
//                 return res;
//             }

//             for (var i = 0; i < 500; i++) {
//                 var itemConf ={
//                     lid: list._id,
//                     title: genTitle() + " #" + (i + 1),
//                     subtitle: genTitle(),
//                     description: genTitle(80)
//                 };

//                 if (Math.floor((Math.random()*10) + 1) % 2 == 0)
//                     itemConf["custom_" + list.customFields[0]._id] = genTitle(3);

//                 ListItemsModel.create(
//                     itemConf,
//                     function(err, item) {
//                     if (err) console.error(err);
//                 });
//             }
//         }

//     });
// }

// function logResults() {
//     if (logOn) console.log('Results');

//     findAllAtModel(UsersModel, function(result) {
//         if (logOn) {
//             console.log('Users');
//             console.log(result);
//         }
//     });

//     findAllAtModel(ListsModel, function(result) {
//         if (logOn) {
//             console.log('Lists');
//             console.log(result);
//         }
//     });
// }

// function findAllAtModel(model, callback) {
//     model.find(null, function(err, result) {
//         if (err) callback(null);
//         else callback(result.length ? result : null);
//     });
// }

// function removeAll() {
//     UsersModel.remove(null, function() {});
//     ListsModel.remove(null, function() {});
// }