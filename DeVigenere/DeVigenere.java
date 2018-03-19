package com.nwuer.crypt;

import java.util.Collection;

/**
 * 1. 首先得算出密钥长度,然后算出密钥,然后得到明文
 * @author vividzc
 *
 */
//"OCWYIKOOONIWUGPMXWKTZDWGTSSAYJZWYEMDLBNQAAAVSUWDVBRFLAUPLOOUBFGQHGCSCMGZLATOEDCSDEIDPBHTMUOVPIEKIFPIMFNOAMVLPQFXEJSMXMPGKCCAYKWFZPYUAVTELWHRHMWKBBNGTGUVTEFJLODFEFKVPXSGRSORVGTAJBSAUHZRZALKWUOWHGEDEFNSWMRCIWCPAAAVOGPDNFPKTDBALSISURLNPSJYEATCUCEESOHHDARKHWOTIKBROQRDFMZGHGUCEBVGWCDQXGPBGQWLPBDAYLOOQDMUHBDQGMYWEUIK"
public class DeVigenere
{
	private String ciphertext;//密文
	private String ciphertextCopy;//密文拷贝
	private double[] textRate = new double[]  //明文中字母出现得频率
			{
					0.082,0.015,0.028,0.042,0.127,0.022,0.02,0.061,0.07,0.001,0.008,0.04,0.024,
					0.068,0.075,0.019,0.001,0.06,0.063,0.09,0.028,0.01,0.024,0.02,0.001,0.001
			};
	private char[] chars = new char[] {'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'};
	private int keyLength; //密钥长度
	private int group; //将密文分成多少组
	private int[] pian; //密钥分量
	
	/**
	 * 初始化各参数
	 * @param ciphertext
	 */
	public DeVigenere(String ciphertext) {
		int len = ciphertext.length();
		this.ciphertext = this.ciphertextCopy = ciphertext.toLowerCase();
		
		this.keyLength = this.getKeyLength();
		if(len % this.keyLength == 0)
			this.group = len/this.keyLength;
		else
			this.group = len/this.keyLength + 1;  //分成多少组
		
		this.pian = new int[this.keyLength]; 
		
	}

	/**
	 * 得到明文
	 * @return
	 */
	public String getText() {
		
		String str = this.ciphertext.toLowerCase();
		StringBuilder text = new StringBuilder();
		int len = this.ciphertext.length();
		
		//依次密钥长度个进行频度分析
		this.getVictor();
		
		
		for(int i=0; i<len; i++) {
			int s = (str.charAt(i)-'a'- (this.pian[i%this.keyLength])) % 26;
			s = s>=0 ? s : s+26;
			text.append(chars[s]);
		}
		return text.toString();
	}
	
	/**
	 * 得到密钥分量
	 * @param victor
	 */
	public void getVictor() {
		int len = this.ciphertext.length();
		int ciphertextLen = this.ciphertext.length(); //密文长度
		int cipherLen = this.getKeyLength(); //密钥长度
		double[] partVictor = new double[this.keyLength];
		//明文字母出现频率向量与密文字母出现频率向量分量相乘
		double tmp = 0.0;
		String[] cipherStr = new String[this.keyLength];
		for(int i=0; i<cipherStr.length; i++)
			cipherStr[i] = "";
		char[] ciphertextArr = this.ciphertext.toCharArray();
		for(int i=0; i<this.keyLength; i++) {
			for(int j=0; j<this.group; j++) {
				int num = i+(j*this.keyLength);
				if(num < ciphertextArr.length)
					cipherStr[i] += ciphertextArr[num];
				else
					cipherStr[i] += "";
			}
		}
		
		for(int i=0; i<this.keyLength; i++) {
				//计算每个子串的频率
				double[] ciphertextRate = new double[26];  //密文中各字符出现频率
				this.getTextRate(cipherStr[i], ciphertextRate);
				partVictor[i] = this.multipy(this.textRate,ciphertextRate,i);
//			}
		}
		
	}
	
	/**
	 * 相当于两个向量相乘  (类似于重合指数法得到每个密钥分量)
	 * @param rate1 明文各向量分量
	 * @param rate2 密文各向量分量
	 * @return
	 */
	public double multipy(double[] rate1, double[] rate2,int location) {
		double[] sum = new double[26];
		int len = rate1.length;
		double max = 0.0;
		int loc = 0;
		for(int i=0; i<len; i++) {
			for(int j=0; j<len; j++) {
				sum[i] += rate1[j] * rate2[(i+j) % 26];
			}
		}
		for(int i=0; i<sum.length;i++) {
			if(max<sum[i]) {
				max=sum[i];
				loc = i;
			}
		}
		this.pian[location] = loc;
		return max;
	}
	
	public void getTextRate(String ciphertext,double[] tmp) {
		int len = ciphertext.length();
		
		int[] num = new int[26];
		for(int i=0; i<len; i++) {
			int t = (ciphertext.charAt(i) - 'a') > 0 ? (ciphertext.charAt(i) - 'a') : -1 * (ciphertext.charAt(i) - 'a') ;
			num[t] ++;
		}
		
		for(int i=0; i<26; i++) {
			tmp[i] = 0.1 * num[i] / len; 
		}
	}
	
	public int getKeyLength() {
		//将一份密文固定,将另一份密文逐步右移,直到两份密文吻合字母总数最多
		//移动密文长度次
		int len = this.ciphertext.length();
		int[] nums = new int[this.ciphertext.length()];
		
		for(int i=1; i<len; i++) {
			int tmpNum = 0;
			for(int j=0; j<len; j++) {
				if(this.ciphertext.charAt(j) == this.ciphertextCopy.charAt((j+i)%len)) {
					//说明有吻合得字母
					tmpNum++;
				}
			}
			nums[i] = tmpNum;
		}
		
		//获取nums数组得最大值,即密钥为nums数组下标+1
		
		return this.max(nums);
	}
	
	/**
	 * 返回数组最大值下标,即密钥长度 (重合指数法)
	 * @param nums数组
	 * @return
	 */
	public int max(int[] nums) {
		int m = 0;
		int value = nums[0];
		for(int i=0;i<nums.length; i++) {
			if(value<nums[i]) {
				value = nums[i];
				m = i;
			}
		}
		return m;
	}
	
}
