function dirty(func) {
    return function() {
        return func() + " tajik";
    };
}

function ne() {
    return "What's up my";
}

const decoratedNe = dirty(ne);
console.log(decoratedNe());
