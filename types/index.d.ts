// TypeScript Version: 2.2

export namespace Empirica {
  // gameInit is where the structure of a game is defined.
  // Just before every game starts, once all the players needed are ready,
  // GameInitCallback is called with the game builder object, which allows the
  // experiment designer to add rounds and stages to the game, and to configure
  // any game, player, round, or stage proporties with UserDate accessors.
  function gameInit(callback: GameInitCallback): string;

  // GameInitCallback is the function you must implement as part of gameInit. It
  // will be given a single argument, the GameBuilder, which contains information
  // about the game (treatment, players) and methods to add rounds and stages to
  // configure the upcoming game.
  type GameInitCallback = (this: undefined, game: GameBuilder) => void;

  // GameBuilder contains the treatment and players participating in this game and
  // allows to add rounds to the game.
  //
  // Note that this is not the created Game object, the Game has not been created
  // yet at this point, the GameBuilder helps configure the Game that will be
  // built.
  interface GameBuilder extends UserDataAccessors {
    // treatment returns the Treatment assigned to this upcoming Game
    readonly treatment: Treatment;

    // players lists the Players assigned to this upcoming Game
    readonly players: Player[];

    // addRound is used to add a Round to the upcoming Game
    addRound: (roundParams: { data: UserData }) => RoundBuilder;
  }

  // RoundBuilder contains user data and stages, and allows to add more stages to
  // the round.
  interface RoundBuilder extends UserDataAccessors {
    // addStage is used to add a Stage to this Round
    addStage?: (
      stageParams: {
        data: UserData;
        name: string;
        displayName: string;
        durationInSeconds: number;
      }
    ) => StageBuilder;
  }

  // StageBuilder contains configuration for the stage.
  interface StageBuilder extends UserDataAccessors {
    // name is the programatic reference that can later be used in the UI code to
    // differentiate stages
    readonly name: string;

    // displayName on the other hand is used in the UI, and
    // it a clean human readable name
    readonly displayName: string;

    // durationInSeconds represents the the maximum duration of a stage
    readonly durationInSeconds: number;
  }

  // User Data fields may contain any data type serializable in JSON.
  type DataValue = any;

  // UserDataAccessors can be found on a number of Empirica objects and allows the
  // experiment designers to store data on these objects.
  interface UserDataAccessors {
    // get returns value found of key on object. get is a source reactive.
    get(key: string): DataValue;

    // set saves the value for key on object. The data is automatically saved to
    // the database and it is synchronized across servers and clients.
    set(key: string, value: DataValue): void;

    // append works like set, but will make the value for key an array and add
    // each new value to the end of that array.
    //
    // Note that a given key for an object must choose between set and append, you
    // cannot mix using set and append on the same key for the same object.
    append(key: string, value: DataValue): void;
  }

  // UserData is a simple key value map. Generally, the only way to access this
  // map is through the UserDataAccessors. If you try to access this map directly,
  // you might be getting stale values and not setting values as you think you
  // are.
  //
  // There are a few cases where you are invited to set the entire UserData object
  // at once, on initialization. This is the only time you should intereact
  // directly with a UserData object.
  interface UserData {
    readonly [factorType: string]: FactorValue;
  }

  // A FactorValue can currently be of type number (int/float) or string.
  //
  // If you need more types (map, array, etc.), we currently recommend you use a
  // static data variable in the code and numerical or textual indexes to
  // reference the variables. For example:
  //   const myVar = { "complex": { a: 1, b: 2 }, "values": [1, 2, 3] }
  //   // Where: myVarFactorValue === "complex"
  //   myVar[myVarFactorValue] // => Gives me my "complex" value back
  type FactorValue = string | number;

  // A Treatment is a map of string to any acceptable factor value type. The
  // string key is the the factorType name, and the value, the chosen value for
  // that type in this treatment.
  interface Treatment {
    readonly [factorType: string]: FactorValue;
  }

  // Player contains all known information about a Player.
  interface Player extends UserDataAccessors {
    // id is used to uniquely identify the player, entered by the
    // player after the consent, or automatically pulled from the URL (See
    // `playerParamId` configurration for details).
    readonly id: string;

    // urlParams contains any URL passed parameters
    readonly urlParams?: object;

    // bot is the name of the bot representing this player. If null, it's a human
    // playing
    readonly bot?: string;
  }
}
