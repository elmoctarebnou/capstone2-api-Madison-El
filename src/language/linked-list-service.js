'use strict';
class _Node {
  constructor(value){
    this.value = value;
    this.next = null;
  }
}
class LinkedList{
  constructor(){
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  push(value){
    const newNode = new _Node(value);
    if(this.head === null){
      this.head = newNode;
      this.tail = newNode;
    }
    else if(this.head.next === null){
      this.head.next = newNode;
      this.tail = newNode;
    }else {
      let current = this.head;
      while(current.next){
        current = current.next;
      }
      current.next = newNode;
      this.tail = newNode;
    }
    this.length ++;
  }
  shift(memory_value){
    let count = 0;
    let newHead = this.head.next;
    let current = this.head;
    if(memory_value >= this.length){
      this.head = newHead;
      this.tail.next = current;
      current.next = null;
      this.tail = current;
      return this;
    }else{
      while(count < memory_value){
        current = current.next;
        count ++;
      }
      this.head.next = current.next;
      current.next = this.head;
      this.head = newHead;
      return this;
    }
  }
  updateIdAndNext(firstId, firstNext){
    let count = 1;
    let current = this.head;
    while(count <= this.length){
      current.value.id = firstId;
      current.value.next = firstNext;
      current = current.next;
      firstId++;
      firstNext++;
      count++;
    }
    this.tail.value.next = null;
    this.tail.next = null;
  }
  updateCorrect(){
    this.head.value.correct_count ++;
    this.head.value.memory_value *= 2;
  }
  updateIncorrect(){
    this.head.value.incorrect_count ++;
    this.head.value.memory_value = 1;
  }
}

module.exports = {
  _Node,
  LinkedList
};