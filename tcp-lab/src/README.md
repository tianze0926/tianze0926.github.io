---
title: TCP 实验报告
shortTitle: TCP Lab
order: 1
---

## 必选功能

### Step 1. TCP 序列号的对比与生成

#### 序列号生成

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

#### 序列号比较

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


### Step 2. TCP 三次握手连接的建立

参考 https://www.rfc-editor.org/rfc/rfc9293#section-3.10.7.3-2.4.1 补全在 SYN_SENT 状态下收到 SYN 和 ACK 时的应对。

::: note 更新接收和发送窗口时应注意
SEG.LEN 应当包含 SYN 和 FIN（ACK 则不在其中）^[https://www.rfc-editor.org/rfc/rfc9293#section-3.4-10]
:::


### Step 3. 简易的发送和接收逻辑

- 更新 `send_tcp_control` 对于 Window 的处理 [^window]

- 更新 `tcp_write`
    - 计算实际发送长度
        ```cpp
        size_t segment_len = 0;
        auto usable_window = tcp->snd_una + tcp->snd_wnd - tcp->snd_nxt;
        segment_len = min(min(bytes_to_send, usable_window), tcp->local_mss);
        ```
    - 设置 ACK ^[https://www.rfc-editor.org/rfc/rfc9293#section-3.1-6.8.1]
    - 设置 Window [^window]

- 更新收包逻辑 ^[https://www.rfc-editor.org/rfc/rfc9293#section-3.10.7.4-2.5.2.2.1]

- 更新 `tcp_read`


[^window]: https://www.rfc-editor.org/rfc/rfc9293#section-3.1-6.16.1


## 总结

- 建议文档和代码中的 RFC 引用改成新发布的全汇总版 [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293)

