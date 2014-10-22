---
published: true
---


I recently started learning a little bit of Clojure. This is the first useful
function I've created. Well, I'd like to think it is useful anyway.

{% highlight clojure %}
(defn divisible-by?
  "Takes a dividend and divisors and returns true if all the divisors go evenly
  into the dividend otherwise false."
  [dividend & divisors]
  (if (not (and (every? #(number? %) divisors) (number? dividend))) false
    (every? #(zero? (mod dividend %)) divisors)))
{% endhighlight %}
