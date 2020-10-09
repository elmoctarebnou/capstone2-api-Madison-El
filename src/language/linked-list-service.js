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
  move(memory_value){
    let count = 0;
    let newHead = this.head.next;
    let current = this.head;
    while(count < memory_value){
      if(current.next === null){
        current.next = this.head;
      }else {
        current = current.next;
      }
      count ++;
    }
    this.head.next = current.next.next;
    current.next = this.head;
    this.head = newHead;
    return this;
  }
}

module.exports = {
  _Node,
  LinkedList
};