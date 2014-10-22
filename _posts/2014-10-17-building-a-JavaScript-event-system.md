---
published: true
---

Demystifying JavaScript events by building an event system from scratch.

The event pattern is a great way to add extensibility and flexibility to your
libraries and frameworks. Simply by emitting events on key actions inside your
code you can allow users of your module to apply their own desired behavior
without having to modify the module itself.

We will take a look at the event pattern by building an event system from
scratch.

## The API
Here's what we're building will look like.
{% highlight javascript %}
events.on('event', function(data) {
  console.log(data.message) // hello
})
events.emit('event', {message: 'hello'})
{% endhighlight %}

## The Essence of the Problem

If we distill events down to their core we discover that an event is nothing
more than a `string`, or as we will call it in this post the namespace, and an
`array` of `functions` attached to it.

So how do we,

* associate `strings` with an `array` of `functions`?
* add `functions` to an `array`?
* call each `function` in an `array` and also pass each one the same arguments?

## Module

To make our event system usable across a wide variety of libraries and
frameworks we will define it as an object and, in this example, export so that
it can be used with [browserify][browserify] or [node][node]. The rest of this
post will assume that we are augmenting the `events` objects.

{% highlight javascript %}
var events = {}
module.exports = events
{% endhighlight %}

## Key value, yo

Using a plain `object` is an elegant way to accomplish our first problem of
associating namespaces with an `array` of `functions`. We can imagine the
`object` will follow this schema:

{% highlight javascript %}
{
  'event': [fnOne, fnTwo, fnThree],
  'event-two': [diffFnOne, diffFnTwo, diffFnThree]
}
{% endhighlight %}

To achieve this format we will simply define a property on our `object` called
`events` that is an empty object. This will become more clear later. Think of
this as a container for events.

{% highlight javascript %}
Object.defineProperty(events, 'events' {
  writable: true,
  enumerable: false,
  configurable: false,
  value: {}
})
{% endhighlight %}

## .push it baby

JavaScript has a really neat feature that is often taken for granted,
first-class functions. This means that `functions` can be stored in `variables`,
passed around inside of other `functions` as `arguments` and otherwise treated
as just regular data. This makes it really easy to create an `array` of
`functions`. All we need to do is use the [`Array.prototype.push`] [.push]
`method` on an array and pass it the `function`!

To add a function to a namespace our `on` method should check if the namespace
already exists as a key on the `events.events` object and if it doesn't, add it.
Then push the function to it.

{% highlight javascript %}
Object.defineProperty(events, 'on', {
  writable: false,
  enumerable: false,
  configurable: false,

  value: function(namespace, fn) {
    // if it's not an array make it one.
    if (!(this.events[namespace] instanceof Array)) {
      this.events[namespace] = []
    }
    // then push the fn to it.
    this.events[namespace].push(fn)
  }
})
{% endhighlight %}

Well that was easy. That's our complete `.on` method!

## .apply those functions

We're going to get a little tricky here but it'll be fun.

First thing is first, to loop through an array and get each `function` we're
going to use [`Array.prototype.forEach`][.forEach]. Then we're going to call each
`function` with [`Function.prototype.apply`][.apply] so that we can pass each
function an array of arguments.

We will also utilize the [`arguments`][arguments] object in order to take
all the values passed after the namespace in the `.emit` method and pass them to
the functions as arguments.

The `arguments` object is an `array-like` object which means it's virtually
useless unless we convert it into a true array. We will use
[`Array.prototype.slice`][.slice] to convert it for us.

{% highlight javascript %}
Object.defineProperty(events, 'emit', {
  writable: false,
  enumerable: false,
  configurable: false,

  value: function(namespace /*, args */) {
    // if this namespace isn't an array or is empty don't do anything with it.
    if (
         !(this.events[namespace] instanceof Array)
      || this.events[namespace].length === 0
    ) {
      this.events[namespace] = []
      return
    }

    // turn this functions arguments object into a true array
    var args = Array.prototype.slice.call(arguments)
    // remove the first argument because that's the namespace
    args.shift()

    // loop through each function
    this.events[namespace].forEach(function(fn) {
      // the first argument to apply determines `this` inside the function it
      // it is applying. In our case, we don't care about it so we make it null.
      fn.apply(null, args)
    })
  }
})
{% endhighlight %}

## The Challenge

We now have a working event system that can easily be added to other libraries
and modules!

Here's a challenge left to the reader:
Concieve and implement a `.off` method that removes a specific function from a
namespace.

[browserify]: http://browserify.org
[node]: http://nodejs.org
[.push]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
[.slice]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
[.forEach]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
[.apply]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/prototype
[arguments]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments