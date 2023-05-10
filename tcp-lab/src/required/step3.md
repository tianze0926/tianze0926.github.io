---
title: Step 3. 简易的发送和接收逻辑
shortTitle: Step 3
---

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
