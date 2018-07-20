package com.nwuer.controller;

import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.nwuer.service.FileSystemService;

class MyFileSystemController {
	private FileSystemService fileSystemService = FileSystemService.getFileSystemService();
	
	private Scanner scanner = new Scanner(System.in);
	
	/*
	  接受键盘输入,进行一系列的操作
	 */
	
	public void showMes() {
		String readStr = null;
		showInitMes();
		Pattern pattern = null;
		Matcher matcher = null;
		while(true) {
			readStr = scanner.nextLine().trim();
//			System.out.println(readStr);
			if(readStr.matches("pwd")) {
//				System.out.println("显示当前路径");
				fileSystemService.pwd();
			}else if(readStr.matches("ls")) {
//				System.out.println("列出目录项");
				fileSystemService.dir();
			}else if(readStr.matches("exit")) { 
				fileSystemService.exit();
			}else if(readStr.matches("help")) { 
				showInitMes();
			}else if(readStr.matches("save")) { 
				fileSystemService.save();
			}else if(readStr.matches("cd\\s+(\\w+)")) {
//				System.out.println("跳转目录");
				pattern = Pattern.compile("cd\\s+(\\w+)");
				matcher = pattern.matcher(readStr);
				if(matcher.find()) { 
					fileSystemService.cdNext(matcher.group(1));
				}
			}else if(readStr.matches("cd\\s+\\.\\.")) {
//				System.out.println("返回上一级");
				if(this.fileSystemService.getFileSystem().getNowPos() == this.fileSystemService.getFileSystem().getRoot()) {
					System.out.println("已是根目录!");
				}else {
					this.fileSystemService.getFileSystem().setNowPos(
							this.fileSystemService.getFileSystem().getNowPos().getParent()
							);
				}
			}else if(readStr.matches("cd\\s+(/.*)")) { //绝对路径访问
				pattern = Pattern.compile("cd\\s+(/.*)");
				matcher = pattern.matcher(readStr);
				if(matcher.find()) { 
//					System.out.println("绝对路径访问: " +matcher.group(1) );
					fileSystemService.cdAbsolute(matcher.group(1));;
				}
			}else if(readStr.matches("mkdir\\s+\\w+")) {
				pattern = Pattern.compile("mkdir\\s+(\\w+)");
				matcher = pattern.matcher(readStr);
				if(matcher.find()) { 
//					System.out.println("创建目录: " +matcher.group(1) );
					fileSystemService.mkdir(matcher.group(1));
				}
			}else if(readStr.matches("mkfile\\s+(\\w+\\.\\w+)\\s*(\\d*)")) {
				pattern = Pattern.compile("mkfile\\s+(\\w+\\.\\w+)\\s*(\\d*)");
				matcher = pattern.matcher(readStr);
				if(matcher.find()) { 
//					System.out.println("创建文件: " +matcher.group(1) );
					Integer type;
					if("".equals(matcher.group(2))) {
						type = 4;
					}else {
						type = Integer.parseInt(matcher.group(2));
					}
					fileSystemService.createFile(matcher.group(1), type);
				}
			}else if(readStr.matches("rm\\s+((\\w+\\.\\w+)|(\\w+))")) {
				pattern = Pattern.compile("rm\\s+((\\w+\\.\\w+)|(\\w+))");
				matcher = pattern.matcher(readStr);
				if(matcher.find()) {
//					System.out.println("删除文件: "+matcher.group(1));
					this.fileSystemService.rm(matcher.group(1));
				}
			}else if(readStr.matches("search\\s+((\\w+\\.\\w+)|(\\w+))")) {
				pattern = Pattern.compile("search\\s+((\\w+\\.\\w+)|(\\w+))");
				matcher = pattern.matcher(readStr);
				if(matcher.find()) {
//					System.out.println("删除文件: "+matcher.group(1));
					this.fileSystemService.search(matcher.group(1));
				}
			}else if(readStr.matches("cat\\s+\\w+\\.\\w+")) {
				pattern = Pattern.compile("cat\\s+(\\w+\\.\\w+)");
				matcher = pattern.matcher(readStr);
				if(matcher.find()) { 
//					System.out.println("查看文件: " +matcher.group(1) );
					this.fileSystemService.cat(matcher.group(1));
				}
			}else if(readStr.matches("change\\s+((\\w+\\.\\w+)|(\\w+))\\s+(\\d)")) {
				pattern = Pattern.compile("change\\s+((\\w+\\.\\w+)|(\\w+))\\s+(\\d)");
				matcher = pattern.matcher(readStr);
				if(matcher.find()) { 
//					System.out.println("改变"+matcher.group(1)+"属性: " +matcher.group(4) );
					this.fileSystemService.changeType(matcher.group(1), Integer.parseInt(matcher.group(4)));
				}
			}else if(readStr.matches("write\\s+(\\w+\\.\\w+)\\s+(\\d)\\s+(.*)")) {  
				pattern = Pattern.compile("write\\s+(\\w+\\.\\w+)\\s+(\\d)\\s+(.*)");
				matcher = pattern.matcher(readStr);
				if(matcher.find()) { 
//					System.out.println("写"+matcher.group(1)+ "action:"+matcher.group(2)+"值: " +matcher.group(3) );
					Integer type = Integer.parseInt(matcher.group(2));
					if(type == 0 || type == 1) {
						this.fileSystemService.write(matcher.group(1), matcher.group(3), type);
					}else {
						System.out.println("参数错误!");
					}
				}
			}else {
				System.out.println("命令格式错误!");
			}
		}
	}
	
	public void showInitMes() {
		System.out.println("\t\t 模拟文件管理系统");
		System.out.println("下面是常用命令提示: ");
		System.out.println("help\t 显示提示信息");
		System.out.println("pwd\t 显示当前路径");
		System.out.println("cd [.][..]\t 跳转当前路径,上一层路径");
		System.out.println("mkdir foldername\t 创建文件夹");
		System.out.println("mkfile filename type\t 创建文件");
		System.out.println("rm [foldername][filename]\t 删除文件夹/文件");
		System.out.println("cat filename\t 查看文件内容");
		System.out.println("dir\t 列出当前文件夹所有项");
		System.out.println("write filename action content\t 写文件 action追加还是覆盖 0:覆盖,1:追加");
		System.out.println("search [filename][foldername] \t 搜索文件或目录  将会列出 name type absolutePath");
		System.out.println("change [filename][foldername] type\t 改变文件属性\ntype 4:普通文件	2:系统文件	1:只读文件");
		
	}
	 
}

public class FileSystemController{
	public static void main(String[] args) {
		new MyFileSystemController().showMes();;
		
	}
}