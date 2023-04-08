---
title: Step 1. TCP 序列号的对比与生成
shortTitle: Step 1
---

## 序列号生成

使用 `std::chrono::steady_clock` 获取单调递增的时间信息，转化为以微秒为单位的时间戳，再右移 2 位即可实现每 4 微秒的时钟：

```cpp
uint32_t generate_initial_seq() {
    using namespace std::chrono;
    auto micros =
        duration_cast<microseconds>(steady_clock::now().time_since_epoch())
            .count();
    return micros >> 2;
}
```

## 序列号比较

若要越界后仍然保留大小关系，则可以将 `uint32` 空间视为圆环：

![](./step1-overflow.svg =300x)

一个直观的定义是判断两数相距是否大于 $2^{31}$，即

$$
x \prec y \Longleftrightarrow
\begin{cases}
    x < y &, |x - y| < 2^{31} \\
    x > y &, |x - y| \geqslant 2^{31}
\end{cases}
$$

此时 $a \prec b,\ a' \succ b$.

在二进制的补码表示下可以利用溢出时符号改变的特性来近似等价地判断绝对值：

```cpp
bool tcp_seq_lt(uint32_t a, uint32_t b) {
    return int32_t(a - b) < 0;
}
```
