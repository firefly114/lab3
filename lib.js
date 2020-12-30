class A {}

class B extends A {}

class UB extends A {}

class C extends A {}

class D extends C {}

class E extends C {}

class F extends E {}

export default {
  parent: A,
  children: [ B, C, D, E, F, UB],
};