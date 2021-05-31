# Web 安全

> 个人总结web安全相关的脑图（持续更新中。。。。。。）
![web安全](./img/web.PNG)


## 网络协议

- OSI七层模型与五层协议体系对照

![OSI七层模型与五层协议体系对照](./img/网络协议层级.PNG)

### UDP协议

> 传输层协议、尽最大努力交付、不保证可靠性、无连接、无阻塞控制、首部开销小(8字节)
> 常用端口号: 53(DNS), 69(TFTP), 161(SNMP)等
> 使用UDP的上层协议: TFTP, DNS, SNMP, NFS, BOOTP等

- udp报文格式
![udp](./img/udp.gif)

- [百度百科UDP协议](https://baike.baidu.com/item/UDP)

### TCP协议

- TCP报文头
![TCP报文头](./img/TCP报文头.png)
    - [TCP报文结构](https://blog.csdn.net/qq_16681169/article/details/50831856)

- [面试官，不要再问我三次握手和四次挥手【掘金】](https://juejin.cn/post/6844903958624878606#heading-0)