function dirty(func) {
    return function() {
        return func() + " nigga";
    };
}

function ne() {
    return "What's up my";
}

const decoratedNe = dirty(ne);
console.log(decoratedNe());

// This is Otabek's commit