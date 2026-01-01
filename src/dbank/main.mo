import Debug "mo:base/Debug";
import Time "mo:base/Time";

actor Dbank {
  var currentValue : Nat = 0;

  public func topUp(amount : Nat) : async Nat {
    currentValue := currentValue + amount;
    return currentValue;
  };

  public func getValue() : async Nat {
    return currentValue;
  };

  public func compound(rate : Nat, periods : Nat) : async Nat {
    var value : Nat = currentValue;
    var i : Nat = 0;
    while (i < periods) {
      value := value + (value * rate) / 100;
      i := i + 1;
    };
    currentValue := value;
    return currentValue;
  };

};
