import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Delete, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface PinLockProps {
  onUnlock: () => void;
}

const DEFAULT_PIN = '1234';

const PinLock = ({ onUnlock }: PinLockProps) => {
  const [pin, setPin] = useState('');
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'new' | 'confirm'>('new');

  const storedPin = localStorage.getItem('pos_pin') || DEFAULT_PIN;

  const handleNumberClick = (num: string) => {
    if (isSettingPin) {
      if (step === 'new' && newPin.length < 4) {
        setNewPin((prev) => prev + num);
      } else if (step === 'confirm' && confirmPin.length < 4) {
        setConfirmPin((prev) => prev + num);
      }
    } else {
      if (pin.length < 4) {
        setPin((prev) => prev + num);
      }
    }
  };

  const handleDelete = () => {
    if (isSettingPin) {
      if (step === 'new') {
        setNewPin((prev) => prev.slice(0, -1));
      } else {
        setConfirmPin((prev) => prev.slice(0, -1));
      }
    } else {
      setPin((prev) => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (isSettingPin) {
      setNewPin('');
      setConfirmPin('');
      setStep('new');
    } else {
      setPin('');
    }
  };

  // Check PIN when 4 digits entered
  useEffect(() => {
    if (pin.length === 4) {
      if (pin === storedPin) {
        toast.success('PIN туура!');
        onUnlock();
      } else {
        toast.error('PIN туура эмес!');
        setPin('');
      }
    }
  }, [pin, storedPin, onUnlock]);

  // Handle new PIN setting
  useEffect(() => {
    if (newPin.length === 4 && step === 'new') {
      setStep('confirm');
    }
  }, [newPin, step]);

  useEffect(() => {
    if (confirmPin.length === 4 && step === 'confirm') {
      if (newPin === confirmPin) {
        localStorage.setItem('pos_pin', newPin);
        toast.success('Жаңы PIN сакталды!');
        setIsSettingPin(false);
        setNewPin('');
        setConfirmPin('');
        setStep('new');
      } else {
        toast.error('PIN-коддор дал келбейт!');
        setConfirmPin('');
      }
    }
  }, [confirmPin, newPin, step]);

  const getCurrentPin = () => {
    if (isSettingPin) {
      return step === 'new' ? newPin : confirmPin;
    }
    return pin;
  };

  const getTitle = () => {
    if (isSettingPin) {
      return step === 'new' ? 'Жаңы PIN киргизиңиз' : 'PIN-ди ырастаңыз';
    }
    return 'PIN-код киргизиңиз';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{getTitle()}</h1>
          <p className="text-muted-foreground mt-2">
            {isSettingPin ? '4 орундуу PIN киргизиңиз' : 'Колдонмого кирүү үчүн'}
          </p>
        </div>

        {/* PIN Display */}
        <div className="flex justify-center gap-4 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                getCurrentPin().length > i
                  ? 'bg-primary scale-110'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <Button
              key={num}
              variant="outline"
              className="h-16 text-2xl font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={() => handleNumberClick(num)}
            >
              {num}
            </Button>
          ))}
          <Button
            variant="outline"
            className="h-16 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
            onClick={handleClear}
          >
            C
          </Button>
          <Button
            variant="outline"
            className="h-16 text-2xl font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
            onClick={() => handleNumberClick('0')}
          >
            0
          </Button>
          <Button
            variant="outline"
            className="h-16 hover:bg-muted"
            onClick={handleDelete}
          >
            <Delete className="w-6 h-6" />
          </Button>
        </div>

        {/* Settings Button */}
        {!isSettingPin && (
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => setIsSettingPin(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            PIN өзгөртүү
          </Button>
        )}

        {isSettingPin && (
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => {
              setIsSettingPin(false);
              setNewPin('');
              setConfirmPin('');
              setStep('new');
            }}
          >
            Артка
          </Button>
        )}

        {/* Default PIN hint */}
        {!localStorage.getItem('pos_pin') && !isSettingPin && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            Демейки PIN: 1234
          </p>
        )}
      </div>
    </div>
  );
};

export default PinLock;
