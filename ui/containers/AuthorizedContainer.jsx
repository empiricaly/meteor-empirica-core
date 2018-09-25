import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

export default (Comp, props) =>
  withTracker(rest => ({
    ...rest,
    ...props,
    user: Meteor.user(),
    loggingIn: Meteor.loggingIn(),
    loading: Meteor.loggingIn(),
    connected: Meteor.status().connected
  }))(Comp);
