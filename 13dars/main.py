class Bird:
    def fly(self):
        print("I am flying!")


class Penguin(Bird):
    def fly(self):
        # This is error
        raise Exception("Penguins can't fly!")


def make_it_fly(bird: Bird):
    bird.fly()


sparrow = Bird()
penguin = Penguin()

make_it_fly(sparrow)   # I am flying!
make_it_fly(penguin)   # ❌ Exception: Penguins can't fly!









