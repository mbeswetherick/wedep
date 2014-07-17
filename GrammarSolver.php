<?php
class GrammarSolver {
	protected $ruleMap = array();
	protected $userSlang;
	protected $fileToDB;
	protected $slangPlusImg = array();

	public function __construct($grammar, $slang){
		$this->fileToDB = array(
			"[n]" => "noun",
			"[adj]" => "adjective",
			"[tv]" => "verb",
			"[affirm]" => "affirmative"
		);
		$this->userSlang = $slang;
		if (isset($grammar)){
			foreach ($grammar as $line) {
				# code...
				$s = explode("::=", $line);
				
				$this->ruleMap[$s[0]] = preg_split("/[|]/", $s[1]); 
			}
	
		}

	}

	public function getSymbols() {
		return array_keys($this->ruleMap);
	}

	public function grammarContains($target){
		#print_r($this->ruleMap);
		return array_key_exists($target, $this->ruleMap);
	}

	public function generate($symbol){
		return trim($this->getRandom($symbol));
	}

	public function getSlangPlusImg(){
		return $this->slangPlusImg;
	}

	public function getRandom($target, $prev = null){
		if(!$this->grammarContains($target)) {
			#print "not contain " . $target;
			#$count = count($this->slangPlusImg);
			if($prev == "[affirm]" Or $prev == "[tv]" Or $prev == "[n]" Or $prev == "[adj]" And rand(0,1) == 0){
				#randomly grab a word of that type
				$wordType = $this->fileToDB[$prev];
				$randomIndex = rand(0, count($this->userSlang[$wordType]) - 1);
				$word = $this->userSlang[$wordType][$randomIndex]['word'];
				$img = $this->userSlang[$wordType][$randomIndex]['image'];
				if($prev == "[affirm]")
					$word .= "!";
				else if($prev == "[v]")
					$word .= "s";
				$this->slangPlusImg[] = array($word, $img);
				return $word . " ";
			 
			} else {
				$this->slangPlusImg[] = array($target, NULL);
				return $target . " ";
			}
		} else {
			$rules = $this->ruleMap[$target];
			$rule = $rules[rand(0, count($rules) - 1)];
	
			$parts = preg_split("/[ \t]+/", trim($rule));
			$result = "";
			foreach ($parts as $s) {
				$result .= $this->getRandom($s, $target);
			}
			$formula = $this->slangPlusImg;
			#$formula = end($formula);
			
			return $result;
		}
	}
}
?>