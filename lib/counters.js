// Named Atomic counters
//
// Example:
//    Counter.inc("something") // => 1
//    Counter.inc("something") // => 2
//    Counter.inc("something", 8) // => 10
//    Counter.inc("something", -5) // => 5
//    Counter.set("something", 42) // => 42

let incset;
if (Meteor.isServer) {
  const raw = new Mongo.Collection("counters").rawCollection();
  findAndModify = Meteor.wrapAsync(raw.findAndModify, raw);

  incset = op => (name, amount = 1) => {
    const res = findAndModify(
      { _id: name }, // query
      null, // sort
      { [`$${op}`]: { value: amount } }, // update
      { new: true, upsert: true } // options
    );
    return res.value && res.value.value;
  };
} else {
  incset = op => () => {};
}

export const Counter = {
  inc: incset("inc"),
  set: incset("set")
};
