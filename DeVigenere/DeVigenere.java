package com.nwuer.crypt;

import java.util.Collection;

/**
 * 1. ���ȵ������Կ����,Ȼ�������Կ,Ȼ��õ�����
 * @author vividzc
 *
 */
//"OCWYIKOOONIWUGPMXWKTZDWGTSSAYJZWYEMDLBNQAAAVSUWDVBRFLAUPLOOUBFGQHGCSCMGZLATOEDCSDEIDPBHTMUOVPIEKIFPIMFNOAMVLPQFXEJSMXMPGKCCAYKWFZPYUAVTELWHRHMWKBBNGTGUVTEFJLODFEFKVPXSGRSORVGTAJBSAUHZRZALKWUOWHGEDEFNSWMRCIWCPAAAVOGPDNFPKTDBALSISURLNPSJYEATCUCEESOHHDARKHWOTIKBROQRDFMZGHGUCEBVGWCDQXGPBGQWLPBDAYLOOQDMUHBDQGMYWEUIK"
public class DeVigenere
{
	private String ciphertext;//����
	private String ciphertextCopy;//���Ŀ���
	private double[] textRate = new double[]  //��������ĸ���ֵ�Ƶ��
			{
					0.082,0.015,0.028,0.042,0.127,0.022,0.02,0.061,0.07,0.001,0.008,0.04,0.024,
					0.068,0.075,0.019,0.001,0.06,0.063,0.09,0.028,0.01,0.024,0.02,0.001,0.001
			};
	private char[] chars = new char[] {'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'};
	private int keyLength; //��Կ����
	private int group; //�����ķֳɶ�����
	private int[] pian; //��Կ����
	
	/**
	 * ��ʼ��������
	 * @param ciphertext
	 */
	public DeVigenere(String ciphertext) {
		int len = ciphertext.length();
		this.ciphertext = this.ciphertextCopy = ciphertext.toLowerCase();
		
		this.keyLength = this.getKeyLength();
		if(len % this.keyLength == 0)
			this.group = len/this.keyLength;
		else
			this.group = len/this.keyLength + 1;  //�ֳɶ�����
		
		this.pian = new int[this.keyLength]; 
		
	}

	/**
	 * �õ�����
	 * @return
	 */
	public String getText() {
		
		String str = this.ciphertext.toLowerCase();
		StringBuilder text = new StringBuilder();
		int len = this.ciphertext.length();
		
		//������Կ���ȸ�����Ƶ�ȷ���
		this.getVictor();
		
		
		for(int i=0; i<len; i++) {
			int s = (str.charAt(i)-'a'- (this.pian[i%this.keyLength])) % 26;
			s = s>=0 ? s : s+26;
			text.append(chars[s]);
		}
		return text.toString();
	}
	
	/**
	 * �õ���Կ����
	 * @param victor
	 */
	public void getVictor() {
		int len = this.ciphertext.length();
		int ciphertextLen = this.ciphertext.length(); //���ĳ���
		int cipherLen = this.getKeyLength(); //��Կ����
		double[] partVictor = new double[this.keyLength];
		//������ĸ����Ƶ��������������ĸ����Ƶ�������������
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
				//����ÿ���Ӵ���Ƶ��
				double[] ciphertextRate = new double[26];  //�����и��ַ�����Ƶ��
				this.getTextRate(cipherStr[i], ciphertextRate);
				partVictor[i] = this.multipy(this.textRate,ciphertextRate,i);
//			}
		}
		
	}
	
	/**
	 * �൱�������������  (�������غ�ָ�����õ�ÿ����Կ����)
	 * @param rate1 ���ĸ���������
	 * @param rate2 ���ĸ���������
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
		//��һ�����Ĺ̶�,����һ������������,ֱ�����������Ǻ���ĸ�������
		//�ƶ����ĳ��ȴ�
		int len = this.ciphertext.length();
		int[] nums = new int[this.ciphertext.length()];
		
		for(int i=1; i<len; i++) {
			int tmpNum = 0;
			for(int j=0; j<len; j++) {
				if(this.ciphertext.charAt(j) == this.ciphertextCopy.charAt((j+i)%len)) {
					//˵�����Ǻϵ���ĸ
					tmpNum++;
				}
			}
			nums[i] = tmpNum;
		}
		
		//��ȡnums��������ֵ,����ԿΪnums�����±�+1
		
		return this.max(nums);
	}
	
	/**
	 * �����������ֵ�±�,����Կ���� (�غ�ָ����)
	 * @param nums����
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
