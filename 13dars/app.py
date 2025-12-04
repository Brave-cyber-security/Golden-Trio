from abc import ABC, abstractmethod

class Bird(ABC):
    @abstractmethod
    def eat(self):
        pass


class FlyingBird(Bird):
    @abstractmethod
    def fly(self):
        pass


class Sparrow(FlyingBird):
    def eat(self):
        print("Sparrow eating")

    def fly(self):
        print("Sparrow flying")


class Penguin(Bird):
    def eat(self):
        print("Penguin eating")
